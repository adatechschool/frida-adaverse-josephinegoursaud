// types.ts
export interface Promotion {
  id: number;
  nom: string;
  dateDebut: string;
}

export interface Project {
  id: number;
  titre: string;
  promotionId: number;
  // ajoute ici les autres champs dont tu as besoin
}
