-- Demo data. Seeded artists have no user_id, so nobody can edit them from the app.

insert into public.artists (id, name, bio, discipline, city, avatar_url, instagram) values
  ('11111111-1111-1111-1111-111111111111', 'Valeria Ríos', 'Pintora de paisajes urbanos con acuarela y tinta.', 'Pintura', 'Guadalajara', 'https://i.pravatar.cc/300?img=47', '@valeria.rios.art'),
  ('22222222-2222-2222-2222-222222222222', 'Diego Martín', 'Fotógrafo documental enfocado en mercados y oficios.', 'Fotografía', 'CDMX', 'https://i.pravatar.cc/300?img=12', '@diegomartin.foto'),
  ('33333333-3333-3333-3333-333333333333', 'Lucía Hernández', 'Ilustradora digital inspirada en el folclor mexicano.', 'Arte digital', 'Monterrey', 'https://i.pravatar.cc/300?img=32', '@lucia.ilustra'),
  ('44444444-4444-4444-4444-444444444444', 'Andrés Salazar', 'Escultor que trabaja con madera recuperada y metal.', 'Escultura', 'Oaxaca', 'https://i.pravatar.cc/300?img=68', '@andres.salazar.esc');

insert into public.artworks (artist_id, title, description, image_url, year, price) values
  ('11111111-1111-1111-1111-111111111111', 'Lluvia en Chapultepec', 'Acuarela sobre papel algodón.', 'https://picsum.photos/seed/art1/800/600', 2025, 3500),
  ('11111111-1111-1111-1111-111111111111', 'Azoteas', 'Tinta y acuarela.', 'https://picsum.photos/seed/art2/800/600', 2026, 2800),
  ('22222222-2222-2222-2222-222222222222', 'Manos de alfarero', 'Impresión giclée.', 'https://picsum.photos/seed/art3/800/600', 2024, 1900),
  ('22222222-2222-2222-2222-222222222222', 'Mercado de Jamaica', 'Serie de 5 fotografías.', 'https://picsum.photos/seed/art4/800/600', 2025, 4200),
  ('33333333-3333-3333-3333-333333333333', 'Alebrije nocturno', 'Ilustración digital, edición limitada.', 'https://picsum.photos/seed/art5/800/600', 2026, 1200),
  ('44444444-4444-4444-4444-444444444444', 'Raíz', 'Madera de mezquite y cobre.', 'https://picsum.photos/seed/art6/800/600', 2025, 8900);
