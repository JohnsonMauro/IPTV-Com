import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

export class EncryptHelper {

  public static ecrypt(text: string): string {
    let result = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), environment.encryptSecret).toString();
    return result
  }

  public static decrypt(text: string): string {
    let result = CryptoJS.AES.decrypt(text, environment.encryptSecret).toString(CryptoJS.enc.Utf8);
    return result
  }

  public static generateRandomDeviceKey(): string {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let t = 0; t < 3; t++) { 
      for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      if(t < 2)
      {
        result += '-';
      }
    }
    return result;
  }
}

