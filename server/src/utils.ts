import { createHmac } from 'node:crypto';

export const dir = (arg: any, depth = null) => console.dir(arg, {depth})

export function createWsIdToken(wsId: string, secret: string) {
  const hmac = createHmac('sha256', secret);
  hmac.update(wsId);
  const signature = hmac.digest('hex');
  return `${wsId}.${signature}`;
}

export function verifyWsIdToken(token: string, secret: string) {
  const [wsId, signature] = token.split('.');
  if (wsId && signature) {
    const expected = createWsIdToken(wsId, secret).split('.')[1];
    return signature === expected ? wsId : null;
  }
  return null
}

const tokenPattern = /^Bearer ([a-zA-Z0-9_-]+)\.([a-f0-9]{64})$/; // Assumes SHA-256 hex digest
export function validateAuthHeader(authHeader: any) {
  return tokenPattern.test(authHeader)
}