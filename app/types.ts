// Une catégorie de billet (ex : "monopalme", "sécurité").
// L'API renvoie les champs avec une majuscule : Id et Libelle.
export type Categorie = {
  Id: number;
  Libelle: string;
};

export type Billet = {
  id: string | number;
  Titre?: string;
  Contenu?: string;
  Date?: string;
  // Un billet peut avoir 0, 1 ou plusieurs catégories (tableau éventuellement vide).
  Categories?: Categorie[];
};

export type Commentaire = {
  id?: string | number;
  Auteur?: string;
  Contenu?: string;
  Date?: string;
};

export type CurrentUser = {
  id: number;
  nom: string;
  email: string;
};

// Réponse de GET /billets/{id} : billet avec ses commentaires imbriqués
export type BilletDetail = Billet & {
  Commentaires?: Commentaire[];
};
