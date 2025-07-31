import { NextRequest, NextResponse } from 'next/server';
import { withCsrf } from '../../../lib/withCsrf';

async function logoutHandler(request: NextRequest) {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.set('session', '', { maxAge: 0, path: '/' });
  response.cookies.set('temp-session', '', { maxAge: 0, path: '/' });
  response.cookies.set('XSRF-TOKEN', '', { maxAge: 0, path: '/' });
  return response;
}

export const POST = withCsrf(logoutHandler);

export const config = {
  runtime: 'nodejs', // Explicitly use Node.js runtime
};