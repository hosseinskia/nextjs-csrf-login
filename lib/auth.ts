import { generateUUID, sanitizeInput } from './security';

const users = [{ email: 'user@secureapp.com', password: 'SecurePass123!' }];

export function validateCredentials(email: string, password: string): boolean {
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPassword = sanitizeInput(password);
  return users.some(
    (user) => user.email === sanitizedEmail && user.password === sanitizedPassword
  );
}

export async function setSession(email: string): Promise<string> {
  const sessionId = generateUUID();
  // In a real app, store sessionId with email in a secure database or Redis
  return sessionId;
}

export async function getSession(sessionId: string): Promise<string | null> {
  // In a real app, validate sessionId against a database or Redis
  return sessionId ? 'user@secureapp.com' : null;
}