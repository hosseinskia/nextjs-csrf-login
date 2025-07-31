import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

export async function generateCsrfToken(sessionId: string) {
  try {
    const token = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    const hmac = CryptoJS.HmacSHA256(
      token + sessionId,
      process.env.CSRF_SECRET || 'default-secret'
    ).toString(CryptoJS.enc.Hex);
    return hmac;
  } catch (err: any) {
    console.error('CSRF token generation error:', err.message);
    throw new Error('Failed to generate CSRF token');
  }
}

export function validateCsrfToken(sentToken: string, storedToken: string) {
  try {
    return sentToken === storedToken;
  } catch (err: any) {
    console.error('CSRF validation error:', err.message);
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>"]/g, '');
}

export function generateUUID(): string {
  return uuidv4();
}