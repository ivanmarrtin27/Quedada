export type GameId =
  | 'preferencias'
  | 'impostor'
  | 'yoNunca'
  | 'verdadesRetos'
  | 'masProbable';

export type CategoryId = 'clasico' | 'amigos' | 'parejas' | 'locuras' | 'picante';

export type Screen =
  | 'home'
  | 'settings'
  | 'preferenciasCategories'
  | 'preferenciasGame'
  | 'impostor'
  | 'yoNunca'
  | 'verdadesRetos'
  | 'masProbable';

export interface Game {
  id: GameId;
  title: string;
  subtitle: string;
  minPlayers: number;
  maxPlayers: number;
  color: string;
  ageRestricted?: boolean;
}

export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  color: string;
  ageRestricted?: boolean;
}

export interface Question {
  id: string;
  categoryId: CategoryId;
  optionA: string;
  optionB: string;
}

export interface ImpostorWord {
  id: string;
  word: string;
  category: string;
}

export interface Statement {
  id: string;
  text: string;
  spicy?: boolean;
}

export interface TruthOrDareCard {
  id: string;
  type: 'verdad' | 'reto';
  text: string;
  spicy?: boolean;
}

export interface MostLikelyPrompt {
  id: string;
  text: string;
  spicy?: boolean;
}

export type Choice = 'A' | 'B';
