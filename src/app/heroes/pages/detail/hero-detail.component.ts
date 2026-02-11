import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of, map } from 'rxjs';
import { HeroesService } from '../../../core/services/heroes.service';

/**
 * Componente para mostrar el detalle completo de un héroe
 */
@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent {
  // Servicios inyectados de forma privada e inmutable
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _heroesService = inject(HeroesService);

  // Signal desde route params usando toSignal (Angular 18 best practice)
  private readonly $heroId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('id') || ''))
  );

  // Signal para estado de carga
  public $isLoading = signal<boolean>(true);
  
  // Signal para mensajes de error
  public $error = signal<string | null>(null);

  // Signal que carga el héroe reactivamente basado en el ID
  public $hero = toSignal(
    toObservable(this.$heroId).pipe(
      switchMap(id => {
        if (!id) {
          this.$error.set('ID no proporcionado');
          this.$isLoading.set(false);
          return of(undefined);
        }
        
        this.$isLoading.set(true);
        this.$error.set(null);
        
        return this._heroesService.getHeroById(id).pipe(
          map(hero => {
            this.$isLoading.set(false);
            return hero;
          })
        );
      })
    )
  );

  /**
   * Navega de vuelta a la lista de héroes
   */
  public goBack(): void {
    this._router.navigate(['/heroes/list']);
  }
}
