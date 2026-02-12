import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Servicio centralizado para gestionar notificaciones tipo Toast usando PrimeNG
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Servicio de mensajes de PrimeNG inyectado
  private readonly _messageService = inject(MessageService);

  /**
   * Muestra una notificación de éxito
   * @param message Mensaje detallado
   * @param summary Título del mensaje (opcional, por defecto 'Éxito')
   * @param opts Opciones adicionales de PrimeNG
   */
  public showSuccess(message: string, summary: string = 'Éxito', opts?: any): void {
    this._messageService.add({
      severity: 'success',
      summary,
      detail: message,
      life: 3000,
      ...opts
    });
  }

  /**
   * Muestra una notificación de error
   * @param message Mensaje detallado
   * @param summary Título del mensaje (opcional, por defecto 'Error')
   * @param opts Opciones adicionales de PrimeNG
   */
  public showError(message: string, summary: string = 'Error', opts?: any): void {
    this._messageService.add({
      severity: 'error',
      summary,
      detail: message,
      life: 5000,
      ...opts
    });
  }

  /**
   * Muestra una notificación de información
   * @param message Mensaje detallado
   * @param summary Título del mensaje (opcional, por defecto 'Información')
   * @param opts Opciones adicionales de PrimeNG
   */
  public showInfo(message: string, summary: string = 'Información', opts?: any): void {
    this._messageService.add({
      severity: 'info',
      summary,
      detail: message,
      life: 3000,
      ...opts
    });
  }

  /**
   * Muestra una notificación de advertencia
   * @param message Mensaje detallado
   * @param summary Título del mensaje (opcional, por defecto 'Advertencia')
   * @param opts Opciones adicionales de PrimeNG
   */
  public showWarn(message: string, summary: string = 'Advertencia', opts?: any): void {
    this._messageService.add({
      severity: 'warn',
      summary,
      detail: message,
      life: 4000,
      ...opts
    });
  }

  /**
   * Limpia todas las notificaciones o una específica por key
   * @param key Clave opcional de la notificación a limpiar
   */
  public clear(key?: string): void {
    this._messageService.clear(key);
  }
}
