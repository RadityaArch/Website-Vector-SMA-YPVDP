import test from 'node:test';
import assert from 'node:assert/strict';
import type { Request } from 'express';
import {
  createSessionToken,
  extractBearerToken,
  isRequestAuthenticated,
  parseCookies,
  verifyAccessPin,
  verifySessionToken,
} from './auth.ts';

test('verifyAccessPin accepts exact code and rejects incorrect codes', () => {
  assert.equal(verifyAccessPin('8267130510', '8267130510'), true);
  assert.equal(verifyAccessPin(' 8267130510 ', '8267130510'), true);
  assert.equal(verifyAccessPin('8267130511', '8267130510'), false);
  assert.equal(verifyAccessPin('', '8267130510'), false);
});

test('createSessionToken and verifySessionToken validate signature and expiry', () => {
  const secret = 'test-secret-key-32-chars-minimum-length';
  const now = 1_700_000_000_000;
  const token = createSessionToken(now, secret);

  assert.equal(verifySessionToken(token, now + 1000, secret), true);
  assert.equal(verifySessionToken(token, now + 25 * 60 * 60 * 1000, secret), false);
  assert.equal(verifySessionToken(`${token}tampered`, now + 1000, secret), false);
  assert.equal(verifySessionToken(token, now + 1000, 'wrong-secret'), false);
});

test('parseCookies extracts key-value pairs cleanly', () => {
  const cookies = parseCookies('foo=bar; vector_editor_session=abc.def%3D; theme=blue');
  assert.equal(cookies.foo, 'bar');
  assert.equal(cookies.vector_editor_session, 'abc.def=');
  assert.equal(cookies.theme, 'blue');
});

test('extractBearerToken and isRequestAuthenticated support Bearer headers and cookies', () => {
  const secret = 'test-secret-key-32-chars-minimum-length';
  const token = createSessionToken(Date.now(), secret);

  assert.equal(extractBearerToken(`Bearer ${token}`), token);
  assert.equal(extractBearerToken('Basic abc123'), null);

  const bearerReq = { headers: { authorization: `Bearer ${token}` } } as unknown as Request;
  const cookieReq = {
    headers: { cookie: `vector_editor_session=${encodeURIComponent(token)}` },
  } as unknown as Request;
  const unauthReq = { headers: {} } as unknown as Request;

  assert.equal(isRequestAuthenticated(bearerReq, secret), true);
  assert.equal(isRequestAuthenticated(cookieReq, secret), true);
  assert.equal(isRequestAuthenticated(unauthReq, secret), false);
});
