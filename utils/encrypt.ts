import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.TOKEN_SECRET as string;

export const encrypt = (data: string): string => {
  if (!data) throw new Error('No data provided for encryption');
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (encryptedData: string): string => {
  if (!encryptedData)
    throw new Error('No encrypted data provided for decryption');

  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) throw new Error('Failed to decrypt data');
  return decrypted;
};
