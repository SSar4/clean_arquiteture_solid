import { Controller } from "../../presentation/controller/protocols/controller"
import { HttpRequest, HttpResponse } from "../../presentation/protocols"

export class LogControllerDecorration implements Controller{
    private readonly controller: Controller
    constructor(controller: Controller) {
        this.controller = controller
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse >{
       await this.controller.handle(httpRequest)
       return {body:{},statusCode:200}
    }
}