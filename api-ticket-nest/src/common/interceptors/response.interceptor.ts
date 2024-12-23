import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
  
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Si la respuesta ya tiene "msg" y "data", no anidamos
        if (data.msg && data.data) {
          return {
            success: true,
            errorMsg: [],
            msg: data.msg,
            data: data.data, // Mantenemos "data" tal como está
          };
        }

        // Caso general
        return {
          success: true,
          errorMsg: [],
          msg: 'Operación exitosa',
          data: data || [],
        };
      }),
      catchError((error) => {
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorMsg =
          error instanceof HttpException
            ? (error.getResponse() as any).message || 'Error desconocido'
            : 'Error del servidor';

        return throwError(() => ({
          success: false,
          errorMsg: Array.isArray(errorMsg) ? errorMsg : [errorMsg],
          msg: error.message || 'Ocurrió un error',
          data: [],
        }));
      }),
    );
  }
}
