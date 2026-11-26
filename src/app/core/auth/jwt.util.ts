import { AuthUser } from './auth.models';
export function decodeJwt(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), (c) =>
      c.charCodeAt(0),
    );
    const payload: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!payload || typeof payload !== 'object') return null;
    if (
      !('sub' in payload) ||
      typeof payload.sub !== 'string' ||
      !payload.sub ||
      !('email' in payload) ||
      typeof payload.email !== 'string' ||
      !('name' in payload) ||
      typeof payload.name !== 'string' ||
      !('iat' in payload) ||
      typeof payload.iat !== 'number' ||
      !Number.isFinite(payload.iat) ||
      !('exp' in payload) ||
      typeof payload.exp !== 'number' ||
      !Number.isFinite(payload.exp)
    )
      return null;
    return payload as AuthUser;
  } catch {
    return null;
  }
}
export function isTokenExpired(user: AuthUser, now = Date.now()): boolean {
  return user.exp * 1000 <= now;
}
