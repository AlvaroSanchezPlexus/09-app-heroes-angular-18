import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HeroesService } from '../../../core/services/heroes.service';
import { Hero } from '../../../core/interfaces/hero.interface';

/**
 * Componente para mostrar la lista completa de héroes
 */
@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [],
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
}
