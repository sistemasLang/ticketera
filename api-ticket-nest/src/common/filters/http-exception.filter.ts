import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Si la excepción ya tiene el formato esperado, úsala directamente
    if (exception && exception.success === false) {
      response.status(HttpStatus.BAD_REQUEST).json(exception);
      return;
    }

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMsg: string[] = [];
    let msg = 'Ocurrió un error';

    if (exception instanceof HttpException) {
      const responseObject = exception.getResponse();
      if (responseObject && typeof responseObject === 'object' && responseObject['message']) {
        errorMsg = Array.isArray(responseObject['message'])
          ? responseObject['message']
          : [responseObject['message']];
        msg = responseObject['error'] || 'Error de Autentificación';
      }
    } else if (exception.message) {
      // Manejar errores genéricos
      errorMsg = [exception.message];
    }

    response.status(status).json({
      success: false,
      errorMsg: errorMsg.length > 0 ? errorMsg : ['Error del servidor'],
      msg: msg || 'Error desconocido',
      data: [],
    });
  }
}
