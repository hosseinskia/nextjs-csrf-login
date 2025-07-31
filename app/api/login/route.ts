import { NextRequest, NextResponse } from 'next/server';
import { withCsrf } from '../../../lib/withCsrf';
import { validateCredentials, setSession } from '../../../lib/auth';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

async function loginHandler(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await rateLimiter.consume(ip).catch(() => {
      throw new Error('Rate limit exceeded');
    });

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!validateCredentials(email, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const sessionId = await setSession(email);
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('session', sessionId, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    });
    response.cookies.set('temp-session', '', { maxAge: 0, path: '/' });
    response.cookies.set('XSRF-TOKEN', '', { maxAge: 0, path: '/' });
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    return response;
  } catch (err: any) {
    console.error('Login error:', err.message);
    return NextResponse.json(
      { error: err.message === 'Rate limit exceeded' ? 'Too many attempts, try again later' : 'Login failed' },
      { status: err.message === 'Rate limit exceeded' ? 429 : 500 }
    );
  }
}

export const POST = withCsrf(loginHandler);

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.has('email') || request.nextUrl.searchParams.has('password')) {
    return NextResponse.json({ error: 'Invalid request method. Use POST for login.' }, { status: 405 });
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const config = {
  runtime: 'nodejs', // Explicitly use Node.js runtime
};