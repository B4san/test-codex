export type ID = string;

export interface Card {
  id: ID;
  title: string;
  description?: string;
}

export interface List {
  id: ID;
  title: string;
  cards: Card[];
}

export interface Board {
  id: ID;
  name: string;
  color: string;
  lists: List[];
}
