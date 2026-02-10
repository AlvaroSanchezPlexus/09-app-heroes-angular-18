import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroesService } from '../../../core/services/heroes.service';
import { Hero } from '../../../core/interfaces/hero.interface';

/**
 * Componente para mostrar la lista completa de héroes
 */
@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroesListComponent implements OnInit {
  // Servicio de héroes inyectado de forma privada e inmutable
  private readonly _heroesService = inject(HeroesService);

  // Signal que almacena la lista de héroes
  public $heroes = signal<Hero[]>([]);

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente
   */
  public ngOnInit(): void {
    this.loadHeroes();
  }

  /**
   * Carga la lista de héroes desde el servicio
   */
  private loadHeroes(): void {
    this._heroesService.getHeroes().subscribe({
      next: (heroes: Hero[]) => {
        this.$heroes.set(heroes);
      }
    });
  }

  /**
   * Elimina un héroe después de confirmación del usuario
   * @param hero Héroe a eliminar
   */
  public deleteHero(hero: Hero): void {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar a ${hero.superhero}?`
    );
    
    if (!confirmDelete) {
      return;
    }
    
    this._heroesService.deleteHero(hero.id).subscribe({
      next: () => {
        this.$heroes.update(heroes => 
          heroes.filter(h => h.id !== hero.id)
        );
      },
      error: (err) => {
        console.error('Error al eliminar héroe:', err);
        alert('No se pudo eliminar el héroe. Inténtalo de nuevo.');
      }
    });
  }
}
