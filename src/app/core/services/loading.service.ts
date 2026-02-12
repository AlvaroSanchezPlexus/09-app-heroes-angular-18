import { Injectable, signal } from '@angular/core';

/**
 * Servicio centralizado para gestionar estado de carga global
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Signal para estado de carga global
  public $isLoading = signal<boolean>(false);
  
  // Contador de requests HTTP activas
  private activeRequests = 0;
  
  /**
   * Incrementa contador y activa loading
   */
  public startLoading(): void {
    this.activeRequests++;
    this.$isLoading.set(true);
  }
  
  /**
   * Decrementa contador y desactiva loading si no hay requests activas
   */
  public stopLoading(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.$isLoading.set(false);
    }
  }
}
