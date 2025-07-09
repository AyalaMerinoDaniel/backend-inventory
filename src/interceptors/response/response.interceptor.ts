import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        created: new Date().toUTCString(),
        statusCode: 200,
        succeed: true,
        message: data?.message || 'Success',
        friendlyMessage: Array.isArray(data?.friendlyMessage)
          ? data.friendlyMessage
          : [data?.friendlyMessage || 'Operación exitosa'],
        result: data?.data !== undefined ? data.data : data,
        error: null,
      })),
      catchError((error) => {
        const response = error.response || error;
        throw new HttpException(
          {
            created: new Date().toUTCString(),
            statusCode: error.status || 500,
            succeed: false,
            message: error.message || 'Internal Server Error',
            friendlyMessage: Array.isArray(response?.message)
              ? response.message
              : [response?.message || 'Ha ocurrido un error'],
            result: null,
            error: response,
          },
          error.status || 500,
        );
      }),
    );
  }
}
