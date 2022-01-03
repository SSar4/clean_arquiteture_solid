import { Encrypter } from "../bcrypt-adapter/encrypter";
import jwt from "jsonwebtoken";

export class JwtAdapter implements Encrypter {
  private readonly secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }
  async encrypter(value: string): Promise<string> {
    const acess_token = jwt.sign({ id: value }, this.secret);
    return acess_token;
  }
}
