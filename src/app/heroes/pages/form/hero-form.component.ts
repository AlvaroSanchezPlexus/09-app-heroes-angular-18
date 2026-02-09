import { Component, signal, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { HeroesService } from '../../../core/services/heroes.service';
import { Hero } from '../../../core/interfaces/hero.interface';

/**
 * Componente de formulario para crear y editar héroes
 */
@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroFormComponent implements OnInit {
  // Servicios inyectados de forma privada e inmutable
  private readonly _fb = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _heroesService = inject(HeroesService);

  // Signal para almacenar el héroe actual (en modo edición)
  public $currentHero = signal<Hero | undefined>(undefined);

  // Signal para indicar si el formulario está siendo enviado
  public $isSubmitting = signal<boolean>(false);

  // Computed signal para determinar si estamos en modo edición
  public $isEditMode = computed(() => this.$currentHero() !== undefined);

  // Computed signal para el título del formulario
  public $formTitle = computed(() => 
    this.$isEditMode() ? 'Editar Héroe' : 'Nuevo Héroe'
  );

  // Computed signal para el texto del botón
  public $submitButtonText = computed(() => 
    this.$isEditMode() ? 'Actualizar Héroe' : 'Crear Héroe'
  );

  // FormGroup tipado
  public heroForm!: FormGroup;

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente
   */
  public ngOnInit(): void {
    this.initializeForm();
    this.loadHeroIfEditing();
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  private initializeForm(): void {
    this.heroForm = this._fb.group({
      id: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      superhero: ['', [Validators.required, Validators.minLength(2)]],
      publisher: ['', Validators.required],
      alter_ego: ['', [Validators.required, Validators.minLength(2)]],
      first_appearance: ['', Validators.required],
      img: ['', Validators.required],
      alt_img: [null]
    });
  }

  /**
   * Carga el héroe si estamos en modo edición
   */
  private loadHeroIfEditing(): void {
    this._route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            return this._heroesService.getHeroById(id);
          }
          return of(undefined);
        })
      )
      .subscribe({
        next: (hero: Hero | undefined) => {
          if (hero) {
            this.$currentHero.set(hero);
            this.heroForm.patchValue(hero);
            // En modo edición, el ID no es editable
            this.heroForm.get('id')?.disable();
          }
        }
      });
  }

  /**
   * Envía el formulario para crear o actualizar un héroe
   */
  public onSubmit(): void {
    if (this.heroForm.invalid || this.$isSubmitting()) {
      this.heroForm.markAllAsTouched();
      return;
    }

    this.$isSubmitting.set(true);

    const heroData: Hero = {
      ...this.heroForm.getRawValue()
    };

    const operation$ = this.$isEditMode()
      ? this._heroesService.updateHero(heroData)
      : this._heroesService.createHero(heroData);

    operation$.subscribe({
      next: (hero: Hero) => {
        this.$isSubmitting.set(false);
        this._router.navigate(['/heroes/detail', hero.id]);
      },
      error: () => {
        this.$isSubmitting.set(false);
      }
    });
  }

  /**
   * Cancela la edición y vuelve a la lista
   */
  public onCancel(): void {
    this._router.navigate(['/heroes/list']);
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   * @param fieldName Nombre del campo a verificar
   * @returns true si el campo tiene errores y ha sido tocado
   */
  public hasError(fieldName: string): boolean {
    const field = this.heroForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   * @param fieldName Nombre del campo
   * @returns Mensaje de error correspondiente
   */
  public getErrorMessage(fieldName: string): string {
    const field = this.heroForm.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'Este campo es obligatorio';
    }
    
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }

    if (field.errors['pattern']) {
      return 'Solo se permiten letras minúsculas, números y guiones';
    }

    return 'Campo inválido';
  }
}
