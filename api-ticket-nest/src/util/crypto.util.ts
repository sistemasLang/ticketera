import * as crypto from 'crypto';

export const generateAuthClient = (): string => {
  return crypto.randomBytes(16).toString('hex'); // 32 caracteres hexadecimales
};

export const generateSecret = (): string => {
  return crypto.randomBytes(32).toString('hex'); // 64 caracteres hexadecimales
};
