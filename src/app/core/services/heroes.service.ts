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

  /**
   * Obtiene un héroe específico por su ID
   * @param id Identificador único del héroe
   * @returns Observable con el héroe encontrado
   */
  public getHeroById(id: string): Observable<Hero> {
    return this._http.get<Hero>(`${this._baseUrl}/${id}`);
  }

  /**
   * Crea un nuevo héroe en el sistema
   * @param hero Objeto héroe a crear
   * @returns Observable con el héroe creado
   */
  public createHero(hero: Hero): Observable<Hero> {
    return this._http.post<Hero>(this._baseUrl, hero);
  }

  /**
   * Actualiza un héroe existente
   * @param hero Objeto héroe con los datos actualizados
   * @returns Observable con el héroe actualizado
   */
  public updateHero(hero: Hero): Observable<Hero> {
    return this._http.put<Hero>(`${this._baseUrl}/${hero.id}`, hero);
  }

  /**
   * Elimina un héroe del sistema
   * @param id Identificador único del héroe a eliminar
   * @returns Observable vacío
   */
  public deleteHero(id: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
