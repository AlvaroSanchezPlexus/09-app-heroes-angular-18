import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor funcional para manejo global de errores HTTP
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Error desconocido';
      
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar al servidor';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor';
      } else {
        errorMessage = error.error?.message || error.message;
      }
      
      return throwError(() => new Error(errorMessage));
    })
  );
};
