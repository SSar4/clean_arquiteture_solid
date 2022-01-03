/* eslint-disable @typescript-eslint/method-signature-style */
export interface Encrypter {
  encrypter (value: string): Promise<string>
}
