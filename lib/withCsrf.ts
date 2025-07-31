import { NextRequest, NextResponse } from 'next/server';
import { validateCsrfToken } from './security';

export function withCsrf(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const csrfToken = request.headers.get('x-csrf-token');
      const storedToken = request.cookies.get('XSRF-TOKEN')?.value;
      if (!csrfToken || !storedToken) {
        console.error('CSRF check failed: Missing token', {
          sent: csrfToken,
          stored: storedToken,
        });
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
      }
      if (!validateCsrfToken(csrfToken, storedToken)) {
        console.error('CSRF check failed: Token mismatch', {
          sent: csrfToken,
          stored: storedToken,
        });
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
      }

      const response = await handler(request);
      response.cookies.set('XSRF-TOKEN', '', { maxAge: 0, path: '/' });
      return response;
    } catch (err: any) {
      console.error('CSRF middleware error:', err.message);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  };
}