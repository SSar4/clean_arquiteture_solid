import { LoadAccountByEmailRepository } from "../../../data/protocols/load-account-email-repository";
import { AccountModel } from "../../models/account";
import { AuthenticationModel } from "../authentication";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication Use Case", () => {
  test("devera chamar LoadAccountByEmail com os valores corretos", async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository{
      async load(email: string): Promise<AccountModel> {
        return new Promise((resolve) =>
          resolve({
            email: "any_email@email.com",
            senha: "any_senha",
            id:'any_id',
            nome:'any_nome'
          })
        );
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth({
      email: "any_email@email.com",
      senha: "any_senha",
    })
      expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
