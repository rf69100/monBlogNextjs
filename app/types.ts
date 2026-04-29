export type Billet = {
  id: string | number;
  Titre?: string;
  Contenu?: string;
  Date?: string;
};

export type Commentaire = {
  id: string | number;
  Contenu?: string;
  Auteur?: string;
  Date?: string;
  billet_id?: string | number;
  user_id?: string | number;
};

// Réponse de GET /billets/{id} : billet avec ses commentaires imbriqués
export type BilletDetail = Billet & {
  commentaires?: Commentaire[];
};
