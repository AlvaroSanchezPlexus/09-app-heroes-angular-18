/**
 * Interfaz que define la estructura de un Héroe
 */
export interface Hero {
  id: string;
  superhero: string;
  publisher: string;
  alter_ego: string;
  first_appearance: string;
  img: string;
  alt_img: string | null;
}
