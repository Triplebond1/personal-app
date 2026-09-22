import { Response } from "express";


export const sendResponse = ( res:Response, statusCode:number, success:boolean, message:string, data?:any ) =>
{
      res.status( statusCode ).json( {
            success,
            message,
            data
      } );
};

export const sendSuccessResponse = ( res:Response, statusCode:number, message:string, data?:any ) =>
{
      return sendResponse( res, statusCode, true, message, data );
};

export const sendErrorResponse = ( res:Response, statusCode:number, message:string, error?:any ) =>
{
      return sendResponse( res, statusCode, false, message, error );
};

