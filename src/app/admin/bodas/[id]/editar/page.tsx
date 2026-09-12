import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { actualizarBoda, registrarVenta, marcarComisionPagada } from "../../actions";
import { InvitarNovios } from "./InvitarNovios";

export default async function EditarBodaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: boda }, { data: colaboradores }, { data: perfilNovios }, { data: ventas }] =
    await Promise.all([
      supabase.from("bodas").select("*").eq("id", id).single(),
      supabase.from("colaboradores").select("id, nombre").order("nombre"),
      supabase.from("perfiles").select("id").eq("boda_id", id).eq("rol", "novios").maybeSingle(),
      supabase.from("ventas").select("*").eq("boda_id", id).order("created_at", { ascending: false }),
    ]);

  if (!boda) notFound();

  // Vinculamos el "id" a la Server Action ANTES de pasarla al formulario.
  // El navegador solo envía los campos del formulario; el id viaja
  // "pegado" a la función gracias a bind, no como un campo oculto que
  // alguien podría manipular.
  const actualizarConId = actualizarBoda.bind(null, id);

  const config = (boda.configuracion ?? {}) as {
    color_primario?: string;
    color_secundario?: string;
    color_acento?: string;
    color_fondo?: string;
    tipografia?: string;
    forma?: string;
    hero_overlay?: string;
    estilo_separador?: string;
    paleta_dresscode?: string[];
    secciones_visibles?: Record<string, boolean>;
    titulos?: Record<string, string>;
  };
  const configSecciones = config.secciones_visibles ?? {};
  const titulos = config.titulos ?? {};

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-medium mb-1">
        {boda.nombre_novia} &amp; {boda.nombre_novio}
      </h1>
      <p className="text-sm text-black/50 mb-6">
        midominio.com/{boda.slug} — este enlace no se puede cambiar aquí.
      </p>

      <div className="mb-8 p-4 rounded-xl border border-black/10 bg-black/[0.015]">
        <h2 className="text-sm font-medium mb-1">Acceso de los novios</h2>
        {perfilNovios ? (
          <p className="text-sm text-green-700">
            ✓ Ya tienen acceso a su propio panel.
          </p>
        ) : (
          <>
            <p className="text-xs text-black/50 mb-3">
              Se les crea la cuenta al momento; tú les compartes el enlace de
              acceso (no depende de que un email llegue solo).
            </p>
            <InvitarNovios bodaId={id} />
          </>
        )}
      </div>

      <div className="mb-8 p-4 rounded-xl border border-black/10 bg-black/[0.015]">
        <h2 className="text-sm font-medium mb-1">Ventas y comisiones</h2>
        <p className="text-xs text-black/40 mb-3">
          Se atribuye al colaborador seleccionado más abajo, en &quot;Datos
          básicos&quot;. Guarda ese campo primero si acabas de cambiarlo.
        </p>

        {ventas && ventas.length > 0 && (
          <div className="divide-y divide-black/10 mb-3">
            {ventas.map((v) => (
              <div key={v.id} className="py-2 flex items-center justify-between text-sm">
                <span>{Number(v.importe).toFixed(2)} € · comisión {Number(v.comision).toFixed(2)} €</span>
                {v.comision_pagada ? (
                  <span className="text-xs text-green-700">pagada</span>
                ) : (
                  <form action={marcarComisionPagada.bind(null, id, v.id)}>
                    <button className="text-xs underline">Marcar como pagada</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}

        <form action={registrarVenta.bind(null, id)} className="flex gap-2">
          <input type="hidden" name="colaborador_id" value={boda.colaborador_id ?? ""} />
          <input
            name="importe"
            type="number"
            step="0.01"
            placeholder="Importe (ej: 1450)"
            required
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <input
            name="comision"
            type="number"
            step="0.01"
            placeholder="Comisión"
            defaultValue={300}
            className="w-28 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-black text-white px-4 py-2 text-sm whitespace-nowrap">
            Registrar venta
          </button>
        </form>
      </div>

      <form action={actualizarConId} className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-sm font-medium mb-2">Datos básicos</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-black/60">Nombre de la novia</label>
              <input
                name="nombre_novia"
                defaultValue={boda.nombre_novia}
                required
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Nombre del novio</label>
              <input
                name="nombre_novio"
                defaultValue={boda.nombre_novio}
                required
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-black/60">Fecha</label>
              <input
                name="fecha_boda"
                type="date"
                defaultValue={boda.fecha_boda ?? ""}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Colaborador</label>
              <select
                name="colaborador_id"
                defaultValue={boda.colaborador_id ?? ""}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              >
                <option value="">Sin asignar</option>
                {colaboradores?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-black/60">
            <input
              type="checkbox"
              name="activa"
              defaultChecked={boda.activa}
            />
            Boda activa (visible públicamente)
          </label>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium mb-2">
            Estilo visual
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-black/60">Color primario</label>
              <input
                name="color_primario"
                type="color"
                defaultValue={config.color_primario ?? "#b08d57"}
                className="w-full h-10 rounded-lg border border-black/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Color secundario</label>
              <input
                name="color_secundario"
                type="color"
                defaultValue={config.color_secundario ?? "#2e2e2e"}
                className="w-full h-10 rounded-lg border border-black/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">
                Color de acento (detalles pequeños)
              </label>
              <input
                name="color_acento"
                type="color"
                defaultValue={config.color_acento ?? config.color_primario ?? "#b08d57"}
                className="w-full h-10 rounded-lg border border-black/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Color de fondo</label>
              <input
                name="color_fondo"
                type="color"
                defaultValue={config.color_fondo ?? "#ffffff"}
                className="w-full h-10 rounded-lg border border-black/10"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-black/60">Tipografía</label>
            <select
              name="tipografia"
              defaultValue={config.tipografia ?? "elegante"}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            >
              <option value="elegante">Elegante (Playfair + Inter)</option>
              <option value="clasico">Clásico (Cormorant + Work Sans)</option>
              <option value="moderno">Moderno (Manrope)</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-black/60">Forma</label>
              <select
                name="forma"
                defaultValue={config.forma ?? "suave"}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              >
                <option value="nitido">Nítido</option>
                <option value="suave">Suave</option>
                <option value="redondeado">Muy redondeado</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Overlay del hero</label>
              <select
                name="hero_overlay"
                defaultValue={config.hero_overlay ?? "oscuro"}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              >
                <option value="oscuro">Oscuro</option>
                <option value="color">Con color</option>
                <option value="suave">Suave</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Separador</label>
              <select
                name="estilo_separador"
                defaultValue={config.estilo_separador ?? "linea"}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              >
                <option value="linea">Línea</option>
                <option value="floral">Floral</option>
                <option value="ninguno">Ninguno</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium mb-2">
            Títulos personalizados
          </legend>
          <p className="text-xs text-black/40">
            Déjalos vacíos para usar los títulos por defecto.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input name="titulo_historia" placeholder="Nuestra historia" defaultValue={titulos.historia ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
            <input name="titulo_cronograma" placeholder="Cronograma" defaultValue={titulos.cronograma ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
            <input name="titulo_ubicacion" placeholder="Ubicación" defaultValue={titulos.ubicacion ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
            <input name="titulo_dresscode" placeholder="Como vestir" defaultValue={titulos.dresscode ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
            <input name="titulo_galeria" placeholder="Momentos" defaultValue={titulos.galeria ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
            <input name="titulo_regalos" placeholder="Vuestra presencia..." defaultValue={titulos.regalos ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
            <input name="titulo_rsvp" placeholder="Confirma tu asistencia" defaultValue={titulos.rsvp ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
            <input name="titulo_faqs" placeholder="Todo lo que necesitas saber" defaultValue={titulos.faqs ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
            <input name="titulo_mensajes" placeholder="Dejadnos un mensaje" defaultValue={titulos.mensajes ?? ""} className="rounded-lg border border-black/10 px-3 py-2 text-sm" />
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium mb-2">
            Paleta de colores del dress code
          </legend>
          <p className="text-xs text-black/40">
            Hasta 5 colores que verán los invitados como guía visual de qué
            tonos vestir. Deja alguno igual a blanco si quieres menos de 5.
          </p>
          <div className="flex gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <input
                key={i}
                name="paleta_dresscode"
                type="color"
                defaultValue={config.paleta_dresscode?.[i] ?? "#ffffff"}
                className="h-12 w-12 rounded-full border border-black/10"
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium mb-2">
            Secciones visibles
          </legend>
          <label className="flex items-center gap-2 text-sm text-black/60">
            <input
              type="checkbox"
              name="mostrar_historia"
              defaultChecked={configSecciones.historia !== false}
            />
            Mostrar &quot;Nuestra historia&quot;
          </label>
          <label className="flex items-center gap-2 text-sm text-black/60">
            <input
              type="checkbox"
              name="mostrar_ubicacion"
              defaultChecked={configSecciones.ubicacion !== false}
            />
            Mostrar &quot;Cómo llegar&quot; (ubicación, hoteles, transporte)
          </label>
          <label className="flex items-center gap-2 text-sm text-black/60">
            <input
              type="checkbox"
              name="mostrar_dresscode"
              defaultChecked={configSecciones.dresscode !== false}
            />
            Mostrar &quot;Dress code&quot;
          </label>
          <label className="flex items-center gap-2 text-sm text-black/60">
            <input
              type="checkbox"
              name="mostrar_galeria"
              defaultChecked={configSecciones.galeria !== false}
            />
            Mostrar &quot;Galería&quot;
          </label>
          <label className="flex items-center gap-2 text-sm text-black/60">
            <input
              type="checkbox"
              name="mostrar_rsvp"
              defaultChecked={configSecciones.rsvp !== false}
            />
            Mostrar &quot;RSVP&quot;
          </label>
          <label className="flex items-center gap-2 text-sm text-black/60">
            <input
              type="checkbox"
              name="mostrar_mensajes"
              defaultChecked={configSecciones.mensajes !== false}
            />
            Mostrar &quot;Libro de firmas&quot;
          </label>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium mb-2">Contenido</legend>
          <div className="space-y-1">
            <label className="text-sm text-black/60">
              URL de la imagen de portada
            </label>
            <input
              name="imagen_portada_url"
              defaultValue={boda.imagen_portada_url ?? ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
            <p className="text-xs text-black/40">
              De momento pega una URL directa. En la Fase 8 añadiremos
              subida de imágenes a Supabase Storage con su propio selector.
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-black/60">Historia de la pareja</label>
            <textarea
              name="historia_pareja"
              defaultValue={boda.historia_pareja ?? ""}
              rows={4}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-black/60">
              Foto que acompaña a la historia (URL)
            </label>
            <input
              name="foto_secundaria_url"
              defaultValue={boda.foto_secundaria_url ?? ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-black/60">Lugar de la ceremonia</label>
              <input
                name="ubicacion_ceremonia"
                defaultValue={boda.ubicacion_ceremonia ?? ""}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Lugar de la celebración</label>
              <input
                name="ubicacion_celebracion"
                defaultValue={boda.ubicacion_celebracion ?? ""}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">
                Latitud (opcional, para el mapa)
              </label>
              <input
                name="lat"
                type="number"
                step="any"
                defaultValue={boda.lat ?? ""}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Longitud (opcional)</label>
              <input
                name="lng"
                type="number"
                step="any"
                defaultValue={boda.lng ?? ""}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-black/60">Dress code</label>
            <input
              name="dress_code"
              defaultValue={boda.dress_code ?? ""}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-black/60">Playlist de Spotify (enlace)</label>
            <input
              name="spotify_playlist_url"
              defaultValue={boda.spotify_playlist_url ?? ""}
              placeholder="https://open.spotify.com/playlist/..."
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium mb-2">Regalo</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-black/60">Número de Venmo</label>
              <input
                name="bizum_numero"
                defaultValue={boda.bizum_numero ?? ""}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-black/60">Datos de transferencia</label>
              <input
                name="datos_transferencia"
                defaultValue={boda.datos_transferencia ?? ""}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium mb-2">Acceso y compartir</legend>
          <div className="space-y-1">
            <label className="text-sm text-black/60">
              Contraseña de acceso (opcional)
            </label>
            <input
              name="password_acceso"
              defaultValue={boda.password_acceso ?? ""}
              placeholder="Déjalo vacío para que sea pública"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- imagen generada por una API externa, no un asset del proyecto */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_SITE_URL}/${boda.slug}`
              )}`}
              alt="Código QR de la boda"
              width={120}
              height={120}
              className="rounded-lg border border-black/10"
            />
            <p className="text-xs text-black/40 max-w-[200px]">
              Escanéalo para abrir la web, o haz clic derecho para guardarlo e
              imprimirlo en las invitaciones físicas.
            </p>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
