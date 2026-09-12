-- ============================================================
-- MIGRACIÓN 0001: Esquema inicial
-- ============================================================
-- Una "migración" es un archivo de texto con instrucciones SQL
-- que describe un cambio en la base de datos. En vez de modificar
-- las tablas a mano desde el panel de Supabase (lo que no deja
-- rastro y es imposible de reproducir en otro entorno), escribimos
-- el cambio aquí. Este archivo se ejecuta una sola vez, en orden,
-- y queda como historial permanente de cómo ha evolucionado la
-- base de datos. Si en el futuro trabajas con otra persona, ella
-- puede reconstruir tu base de datos exacta solo ejecutando estos
-- archivos en orden.
-- ============================================================

-- COLABORADORES
-- Tus clientes B2B (fotógrafos, wedding planners, fincas...).
-- No tienen login: es un registro informativo para saber a quién
-- pertenece cada boda.
create table colaboradores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null check (tipo in ('fotografo', 'wedding_planner', 'finca', 'videografo', 'otro')),
  email_contacto text,
  telefono text,
  created_at timestamptz not null default now()
);

-- BODAS
-- La tabla central. Cada fila es una boda completa.
create table bodas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre_novia text not null,
  nombre_novio text not null,
  fecha_boda date,
  colaborador_id uuid references colaboradores(id) on delete set null,

  -- Contenido editorial
  historia_pareja text,
  imagen_portada_url text,
  ubicacion_ceremonia text,
  ubicacion_celebracion text,
  lat numeric,
  lng numeric,
  dress_code text,
  spotify_playlist_url text,

  -- Datos de regalo directo (Bizum / transferencia)
  bizum_numero text,
  datos_transferencia text,

  -- Ajustes flexibles: colores, tipografía, secciones visibles, etc.
  -- Ver explicación de JSONB en el mensaje anterior.
  configuracion jsonb not null default '{}'::jsonb,

  -- Acceso
  password_acceso text, -- opcional, hash de la contraseña de la boda (no la del admin)
  activa boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_bodas_slug on bodas(slug);
create index idx_bodas_colaborador on bodas(colaborador_id);

-- INVITADOS
-- Lista de invitados de una boda concreta.
create table invitados (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  nombre_completo text not null,
  email text,
  telefono text,
  grupo text, -- ej: "familia novia", "amigos universidad"
  num_acompanantes_permitidos int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_invitados_boda on invitados(boda_id);

-- RSVP
-- La respuesta de confirmación de un invitado. Es una tabla separada
-- de "invitados" porque un invitado puede no haber respondido aún
-- (no tendría fila aquí), y porque guarda datos específicos de su
-- respuesta (menú, alergias) que no tienen sentido antes de responder.
create table rsvp (
  id uuid primary key default gen_random_uuid(),
  invitado_id uuid not null references invitados(id) on delete cascade,
  boda_id uuid not null references bodas(id) on delete cascade,
  asistira boolean,
  num_asistentes_confirmados int not null default 1,
  menu_elegido text,
  alergias text,
  mensaje text,
  respondido_en timestamptz not null default now()
);

create index idx_rsvp_boda on rsvp(boda_id);

-- CRONOGRAMA
create table cronograma (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  hora text not null, -- texto libre, ej: "17:00"
  titulo text not null,
  descripcion text,
  orden int not null default 0
);

create index idx_cronograma_boda on cronograma(boda_id);

-- FAQS
create table faqs (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  pregunta text not null,
  respuesta text not null,
  orden int not null default 0
);

create index idx_faqs_boda on faqs(boda_id);

-- HOTELES
create table hoteles (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  nombre text not null,
  descripcion text,
  enlace text,
  orden int not null default 0
);

create index idx_hoteles_boda on hoteles(boda_id);

-- TRANSPORTE
create table transporte (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  titulo text not null,
  descripcion text,
  horario text,
  orden int not null default 0
);

create index idx_transporte_boda on transporte(boda_id);

-- GALERIA OFICIAL
-- Fotos curadas por el admin (fotógrafo profesional, portada, etc.)
create table galeria_oficial (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  url text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_galeria_boda on galeria_oficial(boda_id);

-- FOTOS SUBIDAS POR INVITADOS
-- Separada de galeria_oficial porque necesita moderación:
-- un invitado sube una foto, y tú decides si se aprueba, se oculta
-- o se elimina antes de que aparezca en el álbum público.
create table fotos_invitados (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  nombre_subido_por text,
  url text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'oculta')),
  created_at timestamptz not null default now()
);

create index idx_fotos_invitados_boda on fotos_invitados(boda_id);

-- MENSAJES (libro de firmas)
create table mensajes (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  nombre_autor text not null,
  mensaje text not null,
  estado text not null default 'aprobado' check (estado in ('pendiente', 'aprobado', 'oculto')),
  created_at timestamptz not null default now()
);

create index idx_mensajes_boda on mensajes(boda_id);

-- REGALOS
create table regalos (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  titulo text not null,
  descripcion text,
  enlace_externo text, -- ej: lista de regalos de El Corte Inglés
  orden int not null default 0
);

create index idx_regalos_boda on regalos(boda_id);

-- Mantiene bodas.updated_at actualizado automáticamente en cada cambio
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_bodas_updated_at
  before update on bodas
  for each row
  execute function set_updated_at();
