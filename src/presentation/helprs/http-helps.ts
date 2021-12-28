import { ServerError } from "../errors/server-error";
import { HttpResponse } from "../protocols";

export const badRequest = (err: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: err
    }
}

export const serverError = (error: Error): HttpResponse => {
    return {
      statusCode: 500,
      body: new ServerError(String(error.stack))
    }
  }
  
  export const success = (data: any): HttpResponse => {
    return {
      statusCode: 200,
      body: data
    }
  }