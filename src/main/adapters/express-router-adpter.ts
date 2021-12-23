import { Controller} from '../../presentation/controller/protocols/controller'
import { Response, Request } from 'express'
import { HttpRequest, HttpResponse } from '../../presentation/protocols'
export const adaptRout = (controller: Controller) => {
    return async (req: Request,res: Response) => {
        const httRequest: HttpRequest = {
            body: req.body
        }
        const httpResponse: HttpResponse = await controller.handle(httRequest)
        res.status(httpResponse.statusCode).json(httpResponse.body)

    }
}