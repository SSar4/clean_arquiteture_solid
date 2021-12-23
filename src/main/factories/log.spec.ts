import { Controller } from "../../presentation/controller/protocols/controller"
import { HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorration } from "../decorations/log"

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async  handle (httpRequest: HttpRequest): Promise<HttpResponse>{
           const httpResponse = {body:{
             email:' email@email.com',
             nome:'nomedf',
             senha: "SAra1234567/",
             senhaConfirme: "SAra1234567/"
            },statusCode:200}

            return new Promise(resolve=>resolve(httpResponse))
        }
     }
     return new ControllerStub()
}
interface SutTypes {
    controllerStub: Controller,
    sut: LogControllerDecorration
}
const makeSut = (): SutTypes => {
     const controllerStub = makeController()
     const sut = new LogControllerDecorration(controllerStub)
     return { controllerStub, sut }
}
describe('LogContollerDecoration', ()=>{
    test('devera chamar o metodo handle do controller', async ()=>{
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub,'handle')
        const httpRequest = {
            body: {
                email:' email@email.com',
                nome:'nomedf',
                senha: "SAra1234567/",
	            senhaConfirme: "SAra1234567/"
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })
})