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
}

