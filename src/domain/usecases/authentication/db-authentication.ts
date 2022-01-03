import { HashCompare } from "../../../data/protocols/cryptography/hash-compare";
import { TokenGeneration } from "../../../data/protocols/cryptography/token";
import { LoadAccountByEmailRepository } from "../../../data/protocols/db/load-account-email-repository";
import { UpdateAcessToken } from "../../../data/protocols/db/update-acess-token-repository";
import { AuthenticationModel } from "../authentication";
import { Authentication } from '../authentication'
export class DbAuthentication implements Authentication{
    private readonly loadAccountByEMailRepository: LoadAccountByEmailRepository
    private readonly hashCompare: HashCompare
    private readonly token: TokenGeneration
    private readonly updateAcessToken: UpdateAcessToken
    constructor(loadAccountByEMailRepository: LoadAccountByEmailRepository,
        hashCompare: HashCompare,
        token: TokenGeneration,
        updateAcessToken: UpdateAcessToken
        ){
        this.hashCompare = hashCompare
        this.loadAccountByEMailRepository = loadAccountByEMailRepository
        this.token = token
        this.updateAcessToken = updateAcessToken
    }
    async auth (login: AuthenticationModel): Promise<string | null>{
        const account = await this.loadAccountByEMailRepository.load(login.email)
        if(account){
            if(await this.hashCompare.compare(login.senha, account.senha)){
            const acess_token = await this.token.generate(account?.id)
            await this.updateAcessToken.update(account.id,acess_token)
            return acess_token}
        }
        
        return null
    }
}