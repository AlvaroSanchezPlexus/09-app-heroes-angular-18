import { Component, signal, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HeroesService } from '../../../core/services/heroes.service';
import { Hero } from '../../../core/interfaces/hero.interface';

/**
 * Componente para mostrar el detalle completo de un héroe
 */
@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent implements OnInit {
  // Servicios inyectados de forma privada e inmutable
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _heroesService = inject(HeroesService);

  // Signal que almacena el héroe actual
  public $hero = signal<Hero | undefined>(undefined);

  // Computed signal para verificar si hay un héroe cargado
  public $hasHero = computed(() => this.$hero() !== undefined);

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente
   */
  public ngOnInit(): void {
    this.loadHero();
  }

  /**
   * Carga el héroe desde el servicio usando el ID de la ruta
   */
  private loadHero(): void {
    this._route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          return this._heroesService.getHeroById(id || '');
        })
      )
      .subscribe({
        next: (hero: Hero) => {
          this.$hero.set(hero);
        }
      });
  }

  /**
   * Navega de vuelta a la lista de héroes
   */
  public goBack(): void {
    this._router.navigate(['/heroes/list']);
  }
}
