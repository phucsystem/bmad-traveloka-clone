import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ErrorCode, ApiResponse } from "@repo/shared";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Internal server error";
    let code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp["message"] as string) ?? exception.message;
        if (resp["error"] && typeof resp["error"] === "object") {
          const errObj = resp["error"] as Record<string, unknown>;
          if (errObj["code"]) {
            code = errObj["code"] as ErrorCode;
          }
        }
      } else {
        message = exception.message;
      }

      if (status === HttpStatus.UNAUTHORIZED) code = ErrorCode.UNAUTHORIZED;
      else if (status === HttpStatus.FORBIDDEN) code = ErrorCode.FORBIDDEN;
      else if (status === HttpStatus.UNPROCESSABLE_ENTITY)
        code = ErrorCode.VALIDATION_ERROR;
      else if (status === HttpStatus.BAD_REQUEST)
        code = ErrorCode.VALIDATION_ERROR;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const body: ApiResponse = {
      success: false,
      error: { code, message },
    };

    response.status(status).json(body);
  }
}
