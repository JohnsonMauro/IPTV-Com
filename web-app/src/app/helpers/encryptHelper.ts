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
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log(result);
    return result;
  }
}

