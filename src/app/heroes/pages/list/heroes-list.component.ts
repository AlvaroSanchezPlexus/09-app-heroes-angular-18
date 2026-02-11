import { Component, signal, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeroesService } from '../../../core/services/heroes.service';
import { Hero } from '../../../core/interfaces/hero.interface';
import { HeroFilterPipe } from '../../../shared/pipes/hero-filter.pipe';

/**
 * Componente para mostrar la lista completa de héroes
 */
@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [RouterLink, HeroFilterPipe],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroesListComponent implements OnInit {
  // Servicios inyectados de forma privada e inmutable
  private readonly _heroesService = inject(HeroesService);
  private readonly _destroyRef = inject(DestroyRef);

  // Signal que almacena la lista de héroes
  public $heroes = signal<Hero[]>([]);
  
  // Signal para el término de búsqueda
  public $searchTerm = signal<string>('');
  
  // Signal para estado de carga
  public $isLoading = signal<boolean>(false);
  
  // Signal para mensajes de error
  public $error = signal<string | null>(null);

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
    this.$isLoading.set(true);
    this.$error.set(null);
    
    this._heroesService.getHeroes().pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (heroes: Hero[]) => {
        this.$heroes.set(heroes);
        this.$isLoading.set(false);
      },
      error: (err) => {
        this.$error.set(err.message || 'Error al cargar los héroes');
        this.$isLoading.set(false);
      }
    });
  }
  
  /**
   * Actualiza el término de búsqueda
   * @param event Evento del input
   */
  public onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.$searchTerm.set(target.value);
  }
  
  /**
   * Limpia el término de búsqueda
   */
  public clearSearch(): void {
    this.$searchTerm.set('');
  }
  
  /**
   * Reintenta cargar los héroes
   */
  public retryLoad(): void {
    this.loadHeroes();
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
    
    this._heroesService.deleteHero(hero.id).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: () => {
        this.$heroes.update(heroes => 
          heroes.filter(h => h.id !== hero.id)
        );
      },
      error: (err) => {
        this.$error.set(err.message || 'No se pudo eliminar el héroe');
      }
    });
  }
}
