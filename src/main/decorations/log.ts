import { LogErrorRepository } from "../../data/protocols/db/log-respository"
import { Controller } from "../../presentation/controller/protocols/controller"
import { HttpRequest, HttpResponse } from "../../presentation/protocols"

export class LogControllerDecorration implements Controller{
    private readonly controller: Controller
    private readonly logError: LogErrorRepository
    constructor(controller: Controller, logError: LogErrorRepository) {
        this.controller = controller
        this.logError = logError
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse >{
       const httResponse: HttpResponse = await this.controller.handle(httpRequest)
     //  console.log(httResponse,'---------------------------------')
     if(httResponse.statusCode==500){
       await this.logError.log(httResponse.body.stack)
     }
       return httResponse
    }
}