'use server';

import crypto from 'node:crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.CRYPTO_KEY!, process.env.CRYPTO_SALT!, 32);
const iv = crypto.randomBytes(16);

export const encrypt = async (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export const decrypt = async (text: string) => {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}