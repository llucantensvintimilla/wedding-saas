-- ============================================================
-- MIGRACIÓN 0002: Row Level Security (RLS)
-- ============================================================
-- Recordatorio del concepto: RLS es una regla que vive DENTRO de
-- la base de datos, no en el código de Next.js. Aunque alguien
-- hable directamente con la API de Supabase sin pasar por tu web,
-- estas reglas se siguen aplicando.
--
-- Roles relevantes en Supabase:
--   - "anon"          -> cualquier visitante público de la web (usa la clave publishable)
--   - "authenticated" -> tú, cuando has iniciado sesión en el panel de admin
--   - "service_role"  -> la clave secreta. Se salta TODAS estas reglas.
--     Por eso es tan importante que esa clave nunca se filtre.
--
-- Al activar RLS en una tabla sin ninguna política, el resultado es
-- "nadie puede acceder a nada" (denegación por defecto). Cada
-- política que añadimos es una EXCEPCIÓN puntual a esa regla.
-- ============================================================

-- Activar RLS en todas las tablas
alter table colaboradores enable row level security;
alter table bodas enable row level security;
alter table invitados enable row level security;
alter table rsvp enable row level security;
alter table cronograma enable row level security;
alter table faqs enable row level security;
alter table hoteles enable row level security;
alter table transporte enable row level security;
alter table galeria_oficial enable row level security;
alter table fotos_invitados enable row level security;
alter table mensajes enable row level security;
alter table regalos enable row level security;

-- ============================================================
-- ADMIN (tú): acceso total a todo, en todas las tablas
-- ============================================================
create policy "admin_acceso_total_colaboradores" on colaboradores for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_bodas" on bodas for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_invitados" on invitados for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_rsvp" on rsvp for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_cronograma" on cronograma for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_faqs" on faqs for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_hoteles" on hoteles for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_transporte" on transporte for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_galeria" on galeria_oficial for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_fotos_invitados" on fotos_invitados for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_mensajes" on mensajes for all to authenticated using (true) with check (true);
create policy "admin_acceso_total_regalos" on regalos for all to authenticated using (true) with check (true);

-- ============================================================
-- PÚBLICO (anon): solo lectura de contenido de bodas ACTIVAS,
-- y solo lo estrictamente necesario para renderizar la página.
-- ============================================================

-- Puede leer una boda activa (para renderizar midominio.com/slug)
create policy "publico_lee_bodas_activas" on bodas
  for select to anon
  using (activa = true);

-- Contenido de solo lectura, siempre que la boda esté activa
create policy "publico_lee_cronograma" on cronograma
  for select to anon
  using (exists (select 1 from bodas where bodas.id = cronograma.boda_id and bodas.activa = true));

create policy "publico_lee_faqs" on faqs
  for select to anon
  using (exists (select 1 from bodas where bodas.id = faqs.boda_id and bodas.activa = true));

create policy "publico_lee_hoteles" on hoteles
  for select to anon
  using (exists (select 1 from bodas where bodas.id = hoteles.boda_id and bodas.activa = true));

create policy "publico_lee_transporte" on transporte
  for select to anon
  using (exists (select 1 from bodas where bodas.id = transporte.boda_id and bodas.activa = true));

create policy "publico_lee_galeria" on galeria_oficial
  for select to anon
  using (exists (select 1 from bodas where bodas.id = galeria_oficial.boda_id and bodas.activa = true));

create policy "publico_lee_regalos" on regalos
  for select to anon
  using (exists (select 1 from bodas where bodas.id = regalos.boda_id and bodas.activa = true));

-- Fotos de invitados y mensajes: el público solo ve lo YA APROBADO.
-- Lo "pendiente" solo lo ve el admin (política de arriba).
create policy "publico_lee_fotos_aprobadas" on fotos_invitados
  for select to anon
  using (estado = 'aprobada');

create policy "publico_lee_mensajes_aprobados" on mensajes
  for select to anon
  using (estado = 'aprobado');

-- El público puede ENVIAR (insertar) contenido, nunca leerlo todo ni modificarlo:
create policy "publico_envia_rsvp" on rsvp
  for insert to anon
  with check (true);

create policy "publico_sube_fotos" on fotos_invitados
  for insert to anon
  with check (estado = 'pendiente'); -- obliga a que toda foto subida por invitados entre en moderación

create policy "publico_escribe_mensajes" on mensajes
  for insert to anon
  with check (true);

-- Nota: "invitados" y "colaboradores" NO tienen ninguna política para "anon".
-- Esto significa acceso público CERO a esas dos tablas, tal y como
-- se explicó antes de este archivo.
