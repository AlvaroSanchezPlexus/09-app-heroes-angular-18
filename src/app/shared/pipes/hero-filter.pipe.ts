import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../../core/interfaces/hero.interface';

/**
 * Pipe para filtrar héroes por término de búsqueda
 */
@Pipe({
  name: 'heroFilter',
  standalone: true,
  pure: true
})
export class HeroFilterPipe implements PipeTransform {
  /**
   * Filtra array de héroes basándose en término de búsqueda
   * @param heroes Array de héroes
   * @param searchTerm Término de búsqueda
   * @returns Array filtrado
   */
  public transform(heroes: Hero[], searchTerm: string): Hero[] {
    if (!searchTerm || !searchTerm.trim()) {
      return heroes;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return heroes.filter(hero =>
      hero.superhero.toLowerCase().includes(term) ||
      hero.alter_ego.toLowerCase().includes(term) ||
      hero.publisher.toLowerCase().includes(term)
    );
  }
}
