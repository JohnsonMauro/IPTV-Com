import * as CryptoJS from 'crypto-js';  
import { environment } from 'src/environments/environment';

export class EncryptHelper {

  public static ecrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, environment.encryptSecret).toString();
  }

  public static decrypt(text: string): string {
    return CryptoJS.AES.decrypt(text, environment.encryptSecret).toString();
  }
}

