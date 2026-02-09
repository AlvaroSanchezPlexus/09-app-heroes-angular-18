import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';

/**
 * Servicio centralizado para gestionar operaciones CRUD de héroes
 */
@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  // Servicio HTTP inyectado de forma privada e inmutable
  private readonly _http = inject(HttpClient);
  
  // URL base del API
  private readonly _baseUrl: string = 'http://localhost:3000/heroes';

  /**
   * Obtiene la lista completa de héroes desde el API
   * @returns Observable con el array de héroes
   */
  public getHeroes(): Observable<Hero[]> {
    return this._http.get<Hero[]>(this._baseUrl);
  }
}
