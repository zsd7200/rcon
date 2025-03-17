'use server';

import crypto from 'node:crypto';

export const envVariablesCheck = async () => {
  if (!process.env.CRYPTO_KEY || !process.env.CRYPTO_SALT) {
    console.warn('');
    console.warn('---------------------------------------')
    console.warn('--------------- WARNING ---------------');
    console.warn('');
    console.warn('ENVIRONMENT VARIABLE(S) MISSING');
    console.warn('MISSING VARIBLE(S) SET RANDOMLY');
    console.warn('PLEASE CHANGE YOUR .ENV TO MATCH THE BELOW TEXT,');
    console.warn('THEN RESTART PROGRAM.');
    console.warn('');
    console.warn(
`
CRYPTO_KEY=${process.env.CRYPTO_KEY ?? crypto.randomUUID()}
CRYPTO_SALT=${process.env.CRYPTO_SALT ?? crypto.randomUUID()}
`
  );
    console.warn('');
    console.warn('--------------- WARNING ---------------');
    console.warn('---------------------------------------')
    console.warn('');
  }
}

const setVariables = async () => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.CRYPTO_KEY!, process.env.CRYPTO_SALT!, 32);
  const iv = crypto.randomBytes(16);
  return { algorithm, key, iv };
}

export const encrypt = async (text: string) => {
  const { algorithm, key, iv } = await setVariables();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export const decrypt = async (text: string) => {
  const { algorithm, key } = await setVariables();
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}