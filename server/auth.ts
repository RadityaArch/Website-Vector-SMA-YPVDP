import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';

const SESSION_COOKIE_NAME = 'vector_editor_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getAdminPin(): string {
  return process.env.VECTOR_ADMIN_PIN || '8267130510';
}

function getOrCreateSessionSecret(): string {
  if (process.env.VECTOR_SESSION_SECRET) {
    return process.env.VECTOR_SESSION_SECRET;
  }
  const dataDir = path.resolve(process.cwd(), 'data');
  const secretPath = path.join(dataDir, '.session-secret');
  try {
    if (fs.existsSync(secretPath)) {
      const existing = fs.readFileSync(secretPath, 'utf8').trim();
      if (existing.length >= 32) return existing;
    }
    fs.mkdirSync(dataDir, { recursive: true });
    const generated = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(secretPath, generated, { mode: 0o600 });
    return generated;
  } catch {
    return crypto.randomBytes(32).toString('hex');
  }
}

const SESSION_SECRET = getOrCreateSessionSecret();

export function verifyAccessPin(submittedPin: string, expectedPin = getAdminPin()): boolean {
  const cleanSubmitted = String(submittedPin || '').trim();
  const cleanExpected = String(expectedPin || '').trim();
  if (!cleanSubmitted || !cleanExpected) return false;
  const submittedDigest = crypto.createHash('sha256').update(cleanSubmitted).digest();
  const expectedDigest = crypto.createHash('sha256').update(cleanExpected).digest();
  return crypto.timingSafeEqual(submittedDigest, expectedDigest);
}

export function createSessionToken(nowMs = Date.now(), secret = SESSION_SECRET): string {
  const payload = JSON.stringify({
    role: 'editor',
    iat: nowMs,
    exp: nowMs + SESSION_TTL_MS,
  });
  const encodedPayload = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined | null,
  nowMs = Date.now(),
  secret = SESSION_SECRET
): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expectedBuf = Buffer.from(expectedSignature, 'utf8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (decoded.role !== 'editor') return false;
    if (typeof decoded.exp !== 'number' || decoded.exp <= nowMs) return false;
    return true;
  } catch {
    return false;
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) {
      result[key] = decodeURIComponent(val);
    }
  }
  return result;
}

function isHttpsRequest(req: Request): boolean {
  if (req.secure) return true;
  const forwarded = String(req.headers['x-forwarded-proto'] || '')
    .split(',')[0]
    .trim()
    .toLowerCase();
  return forwarded === 'https';
}

export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export function isRequestAuthenticated(req: Request, secret = SESSION_SECRET): boolean {
  const bearer = extractBearerToken(req.headers.authorization);
  if (bearer && verifySessionToken(bearer, Date.now(), secret)) {
    return true;
  }
  const cookies = parseCookies(req.headers.cookie);
  return verifySessionToken(cookies[SESSION_COOKIE_NAME], Date.now(), secret);
}

export function setEditorSessionCookie(req: Request, res: Response): string {
  const token = createSessionToken();
  const isHttps = isHttpsRequest(req);
  const flags = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    isHttps ? 'SameSite=None' : 'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];
  if (isHttps) {
    flags.push('Secure', 'Partitioned');
  }
  res.setHeader('Set-Cookie', flags.join('; '));
  return token;
}

export function clearEditorSessionCookie(req: Request, res: Response): void {
  const isHttps = isHttpsRequest(req);
  const flags = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    isHttps ? 'SameSite=None' : 'SameSite=Lax',
    'Max-Age=0',
  ];
  if (isHttps) {
    flags.push('Secure', 'Partitioned');
  }
  res.setHeader('Set-Cookie', flags.join('; '));
}

export function requireEditorAuth(req: Request, res: Response, next: NextFunction): void {
  if (!isRequestAuthenticated(req)) {
    res.status(401).json({ error: 'Autentikasi diperlukan untuk melakukan tindakan editor.' });
    return;
  }
  next();
}
