import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken, generateUUID } from '../../../lib/security';

export async function GET(request: NextRequest) {
  try {
    // Use existing session ID or create a temporary one for unauthenticated users
    let sessionId = request.cookies.get('temp-session')?.value || request.cookies.get('session')?.value;
    if (!sessionId) {
      sessionId = generateUUID();
    }

    const token = await generateCsrfToken(sessionId);
    const response = NextResponse.json({ csrfToken: token });
    response.cookies.set('XSRF-TOKEN', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    });
    if (!request.cookies.get('session')?.value) {
      response.cookies.set('temp-session', sessionId, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        path: '/',
      });
    }
    return response;
  } catch (err: any) {
    console.error('CSRF generation error:', err.message);
    return NextResponse.json({ error: 'Failed to generate security token' }, { status: 500 });
  }
}

export const config = {
  runtime: 'nodejs', // Explicitly use Node.js runtime
};