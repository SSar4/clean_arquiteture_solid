import { LogErrorRepository } from "../../data/protocols/log-respository"
import { Controller } from "../../presentation/controller/protocols/controller"
import { serverError, success } from "../../presentation/helprs/http/http-helps"
import { HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorration } from "../decorations/log"

const makeRequest = (): HttpRequest =>{
   const body = {
       body:{
       email:' email@email.com',
       nome:'nomedf',
       senha: "SAra1234567/",
       senhaConfirme: "SAra1234567/"}
    }
    return body
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async  handle (httpRequest: HttpRequest): Promise<HttpResponse>{
           const httpResponse = success(makeRequest())

            return new Promise(resolve=>resolve(httpResponse))
        }
     }
     return new ControllerStub()
}

const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_error'
    return serverError(fakeError)
}

const LogErrorRepositoryStub = (): LogErrorRepository =>{
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(error: string): Promise<void>{
            return new Promise(resolve=> resolve())
        }
    }

    return new LogErrorRepositoryStub()
}
interface SutTypes {
    controllerStub: Controller,
    sut: LogControllerDecorration,
    logErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
     const controllerStub = makeController()
     const logErrorRepositoryStub = LogErrorRepositoryStub()
     const sut = new LogControllerDecorration(controllerStub, logErrorRepositoryStub)
     return { controllerStub, sut, logErrorRepositoryStub }
}
describe('LogContollerDecoration', ()=>{
    test('devera chamar o metodo handle do controller', async ()=>{
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub,'handle')
        await sut.handle(makeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeRequest())
    })

    test('devera retorna um httpResponse', async ()=>{
        const { sut } = makeSut()
        const response = await sut.handle(makeRequest())
        expect(response).toEqual(success(makeRequest()))
    })

    test('devera chamar o logErrorErrorRespository com o erro correto se o retorno retorna 500', async ()=>{
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub,'handle').mockReturnValueOnce(new Promise(resolve=> resolve( makeFakeServerError())))
    
        await sut.handle(makeRequest())
        expect(logSpy).toHaveBeenCalledWith('any_error')
    })
})