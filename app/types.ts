export type Billet = {
  id: string | number;
  Titre?: string;
  Contenu?: string;
  Date?: string;
};

export type Commentaire = {
  id: string | number;
  contenu?: string;
  date?: string;
  billet_id?: string | number;
  user_id?: string | number;
  user?: { nom?: string };
  nom?: string;
};

export type CurrentUser = {
  id: number;
  nom: string;
  email: string;
};

// Réponse de GET /billets/{id} : billet avec ses commentaires imbriqués
export type BilletDetail = Billet & {
  commentaires?: Commentaire[];
};
