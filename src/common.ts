import { createCipheriv, createDecipheriv } from "crypto";
import { deflateSync, inflateSync } from 'zlib';

export function aesEncrypt(data: Uint8Array, secret: Uint8Array): Uint8Array {
  const key = fillKey(secret);
  const cipher = createCipheriv(getAesAlgo(key.length), key, key.slice(0, 16));
  const value = cipher.update(data, undefined, 'base64') + cipher.final('base64');
  const encryptedData = new Uint8Array(Buffer.from(value, 'base64'));
  return encryptedData;
}


export function aesDecrypt(data: Uint8Array, secret: Uint8Array): Uint8Array {
  const key = fillKey(secret);
  const decipher = createDecipheriv(getAesAlgo(key.length), key, key.slice(0, 16));
  decipher.setAutoPadding(true);
  const value = decipher.update(Buffer.from(data).toString('base64'), 'base64', 'base64') + decipher.final('base64');
  const decryptedData = new Uint8Array(Buffer.from(value, 'base64'));
  return decryptedData;
}

function getAesAlgo(len: number) {
  if (len > 24) {
    return 'aes-256-cbc';
  } else if (len > 16) {
    return 'aes-192-cbc';
  } else {
    return 'aes-128-cbc';
  }
}

function fillKey(key: Uint8Array): Uint8Array {
  const l = key.length;
  if (l === 16) {
    return key;
  }
  if (l < 16) {
    return fillN(key, 16);
  }
  return key.slice(0, 16);
}

function fillN(s: Uint8Array, count: number): Uint8Array {
  const l = s.length;
  const c = Math.floor(count / l);
  const m = count % l;
  const bf = new Uint8Array(count);
  let i = 0;
  const bytes = new Uint8Array(Buffer.from(s));
  for (; i < c; i++) {
    bf.set(bytes, i * l);
  }
  if (m !== 0) {
    bf.set(bytes.slice(0, m), i * l);
  }
  return bf;
}

export async function encode(data: Uint8Array, key: Uint8Array) {
  return aesEncrypt(deflateSync(data), key);
}

export function decode(data: Uint8Array, key: Uint8Array) {
  return inflateSync(aesDecrypt(data, key));
}