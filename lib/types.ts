export type Artist = {
  id: string;
  user_id: string | null;
  name: string;
  bio: string | null;
  discipline: string;
  city: string | null;
  avatar_url: string | null;
  instagram: string | null;
  website: string | null;
  created_at: string;
};

export type Artwork = {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  image_url: string;
  year: number | null;
  price: number | null;
  created_at: string;
};

export type ContactRequest = {
  id: string;
  artist_id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  created_at: string;
};
