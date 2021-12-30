import { LoadAccountByEmailRepository } from "../../../data/protocols/load-account-email-repository";
import { AccountModel } from "../../models/account";
import { AuthenticationModel } from "../authentication";
import { Authentication } from '../authentication'
export class DbAuthentication implements Authentication{
    private readonly loadAccountByEMailRepository: LoadAccountByEmailRepository
    constructor(loadAccountByEMailRepository: LoadAccountByEmailRepository){
        this.loadAccountByEMailRepository = loadAccountByEMailRepository
    }
    async auth (login: AuthenticationModel): Promise<string>{
        this.loadAccountByEMailRepository.load(login.email)

        return ''
    }
}