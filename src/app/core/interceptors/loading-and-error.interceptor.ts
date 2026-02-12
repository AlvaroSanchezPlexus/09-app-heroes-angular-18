import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';

/**
 * Interceptor funcional para loading global y manejo de errores HTTP
 */
export const loadingAndErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const toastService = inject(ToastService);
  
  // Iniciar loading antes de la request
  loadingService.startLoading();
  
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

      // Mostrar notificación de error
      toastService.showError(errorMessage);
      
      return throwError(() => new Error(errorMessage));
    }),
    finalize(() => {
      // Detener loading al finalizar (éxito o error)
      loadingService.stopLoading();
    })
  );
};
