import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBodaPorSlug } from "@/lib/bodas";
import { calcularModoBoda, calcularDiasCasados } from "@/lib/modo-boda";
import {
  getCronograma,
  getHoteles,
  getTransporte,
  getRegalos,
  getFaqs,
  getGaleriaOficial,
  getFotosAprobadas,
  getMensajesAprobados,
} from "@/lib/contenido-boda";
import { Hero } from "@/components/wedding/Hero";
import { Countdown } from "@/components/wedding/Countdown";
import { HoyEsElDia } from "@/components/wedding/HoyEsElDia";
import { DiasCasados } from "@/components/wedding/DiasCasados";
import { Historia } from "@/components/wedding/Historia";
import { Cronograma } from "@/components/wedding/Cronograma";
import { Ubicacion } from "@/components/wedding/Ubicacion";
import { Hoteles } from "@/components/wedding/Hoteles";
import { Transporte } from "@/components/wedding/Transporte";
import { DressCode } from "@/components/wedding/DressCode";
import { Spotify } from "@/components/wedding/Spotify";
import { Galeria } from "@/components/wedding/Galeria";
import { Regalos } from "@/components/wedding/Regalos";
import { Faqs } from "@/components/wedding/Faqs";
import { RSVP } from "@/components/wedding/RSVP";
import { LibroDeFirmas } from "@/components/wedding/LibroDeFirmas";
import { CompartirWhatsApp } from "@/components/wedding/CompartirWhatsApp";
import { Monograma } from "@/components/wedding/Monograma";
import { AnadirCalendario } from "@/components/wedding/AnadirCalendario";
import { Navegacion, type SeccionNav } from "@/components/wedding/Navegacion";
import { FadeIn } from "@/components/FadeIn";
import { WeddingThemeProvider } from "@/components/wedding/WeddingThemeProvider";
import { InvitationExperience } from "@/components/wedding/InvitationExperience";
import { LuxuryPreset, AnimationLevel } from "@/lib/wedding-themes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const boda = await getBodaPorSlug(slug);
  if (!boda) return {};

  const titulo = `${boda.nombre_novia} & ${boda.nombre_novio}`;
  const descripcion = boda.fecha_boda
    ? `All the details for our wedding — ${new Date(
        boda.fecha_boda + "T00:00:00"
      ).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}`
    : "All the details for our wedding";

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      images: boda.imagen_portada_url ? [boda.imagen_portada_url] : [],
    },
  };
}

export default async function BodaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const boda = await getBodaPorSlug(slug);
  if (!boda) notFound();

  const modo = calcularModoBoda(boda.fecha_boda);

  const [cronograma, hoteles, transporte, regalos, faqs, fotosOficiales, fotosInvitados, mensajes] =
    await Promise.all([
      getCronograma(boda.id),
      getHoteles(boda.id),
      getTransporte(boda.id),
      getRegalos(boda.id),
      getFaqs(boda.id),
      getGaleriaOficial(boda.id),
      getFotosAprobadas(boda.id),
      getMensajesAprobados(boda.id),
    ]);

  const config = (boda.configuracion ?? {}) as {
    luxury_preset?: LuxuryPreset;
    animation_level?: AnimationLevel;
    paleta_dresscode?: string[];
    secciones_visibles?: Record<string, boolean>;
    estilo_separador?: "linea" | "floral" | "ninguno";
    hero_overlay?: "oscuro" | "color" | "suave";
    titulos?: Record<string, string>;
  };
  const mostrar = (clave: string) => config.secciones_visibles?.[clave] !== false;
  const t = (clave: string, porDefecto: string) => config.titulos?.[clave] || porDefecto;
  const estiloSeparador = config.estilo_separador ?? "linea";

  const mostrarRSVP = mostrar("rsvp") && modo === "antes";

  const hayRegalos = regalos.length > 0 || boda.bizum_numero || boda.datos_transferencia;
  const mostrarRegalos = hayRegalos && modo !== "despues";

  const tituloCronograma =
    modo === "durante" ? "Happening today" : t("cronograma", "Schedule");
  const tituloGaleria =
    modo === "durante"
      ? "Share your photos live"
      : modo === "despues"
        ? "Relive the day"
        : t("galeria", "Moments");

  const todasLasFotos = [
    ...fotosOficiales.map((f) => ({ id: f.id, url: f.url, esOficial: true })),
    ...fotosInvitados.map((f) => ({
      id: f.id,
      url: f.url,
      nombreSubidoPor: f.nombre_subido_por,
      esOficial: false,
    })),
  ];

  const secciones: SeccionNav[] = [
    mostrar("historia") && { id: "historia", etiqueta: "Our story" },
    cronograma.length > 0 && { id: "cronograma", etiqueta: "Schedule" },
    mostrar("ubicacion") &&
      (boda.ubicacion_ceremonia || boda.ubicacion_celebracion) &&
      { id: "como-llegar", etiqueta: "Getting there" },
    mostrar("dresscode") && { id: "dresscode", etiqueta: "Dress code" },
    boda.spotify_playlist_url && { id: "musica", etiqueta: "Music" },
    mostrar("galeria") && { id: "galeria", etiqueta: "Gallery" },
    mostrarRegalos && { id: "regalos", etiqueta: "Gift" },
    mostrarRSVP && { id: "rsvp", etiqueta: "RSVP" },
    faqs.length > 0 && { id: "faqs", etiqueta: "FAQ" },
    mostrar("mensajes") && { id: "firmas", etiqueta: "Guestbook" },
  ].filter((s): s is SeccionNav => Boolean(s));

  return (
    <WeddingThemeProvider
      preset={config.luxury_preset ?? "gold_minimal"}
      animation={config.animation_level ?? "subtle"}
    >
      <InvitationExperience
        nombreNovia={boda.nombre_novia}
        nombreNovio={boda.nombre_novio}
      >
        <main>
          <Navegacion
            nombreCorto={`${boda.nombre_novia} & ${boda.nombre_novio}`}
            secciones={secciones}
          />

          <div id="inicio">
            <Hero
              nombreNovia={boda.nombre_novia}
              nombreNovio={boda.nombre_novio}
              imagenPortadaUrl={boda.imagen_portada_url}
              fechaBoda={boda.fecha_boda}
              overlay={config.hero_overlay ?? "oscuro"}
              modo={modo}
            />
          </div>

          <div className="relative overflow-hidden">
            <Monograma
              inicialNovia={boda.nombre_novia[0]}
              inicialNovio={boda.nombre_novio[0]}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            />

            {boda.fecha_boda && (
              <section className="relative z-10 py-16 px-6 text-center">
                <FadeIn>
                  {modo === "antes" && (
                    <>
                      <Countdown fechaBoda={boda.fecha_boda} />
                      <AnadirCalendario
                        titulo={`${boda.nombre_novia} & ${boda.nombre_novio}'s wedding`}
                        fecha={boda.fecha_boda}
                        ubicacion={boda.ubicacion_celebracion}
                      />
                    </>
                  )}
                  {modo === "durante" && <HoyEsElDia />}
                  {modo === "despues" && (
                    <DiasCasados dias={calcularDiasCasados(boda.fecha_boda)} />
                  )}
                </FadeIn>
              </section>
            )}

            {mostrar("historia") && (
              <div id="historia" className="relative z-10 scroll-mt-20">
                <Historia
                  texto={boda.historia_pareja}
                  fotoUrl={boda.foto_secundaria_url}
                  titulo={t("historia", "How it all began")}
                  estiloSeparador={estiloSeparador}
                />
              </div>
            )}
          </div>

          {cronograma.length > 0 && (
            <div id="cronograma" className="scroll-mt-20 bg-secondary/[0.025]">
              <Cronograma
                items={cronograma}
                titulo={tituloCronograma}
                estiloSeparador={estiloSeparador}
              />
            </div>
          )}

          {mostrar("ubicacion") && (
            <div id="como-llegar" className="scroll-mt-20">
              <Ubicacion
              ceremonia={boda.ubicacion_ceremonia}
              celebracion={boda.ubicacion_celebracion}
              lat={boda.lat}
              lng={boda.lng}
              titulo={t("ubicacion", "Location")}
              estiloSeparador={estiloSeparador}
            />
            <Hoteles hoteles={hoteles} />
            <Transporte items={transporte} />
          </div>
        )}

        {mostrar("dresscode") && (
          <div id="dresscode" className="scroll-mt-20 bg-secondary/[0.025]">
            <DressCode
              texto={boda.dress_code}
              paleta={config.paleta_dresscode ?? []}
              titulo={t("dresscode", "What to wear")}
              estiloSeparador={estiloSeparador}
            />
          </div>
        )}

        {boda.spotify_playlist_url && (
          <div id="musica" className="scroll-mt-20">
            <Spotify url={boda.spotify_playlist_url} />
          </div>
        )}

        {mostrar("galeria") && (
          <div id="galeria" className="scroll-mt-20">
            <Galeria
              bodaId={boda.id}
              fotosIniciales={todasLasFotos}
              titulo={tituloGaleria}
            />
          </div>
        )}

        {mostrarRegalos && (
          <div id="regalos" className="scroll-mt-20 bg-secondary/[0.025]">
            <Regalos
              regalos={regalos}
              bizumNumero={boda.bizum_numero}
              datosTransferencia={boda.datos_transferencia}
              titulo={t("regalos", "Your presence is the best gift")}
              estiloSeparador={estiloSeparador}
            />
          </div>
        )}

        {mostrarRSVP && (
          <div id="rsvp" className="scroll-mt-20">
            <RSVP
              bodaId={boda.id}
              titulo={t("rsvp", "Confirm your attendance")}
              estiloSeparador={estiloSeparador}
            />
          </div>
        )}

        {faqs.length > 0 && (
          <div id="faqs" className="scroll-mt-20 bg-secondary/[0.025]">
            <Faqs faqs={faqs} titulo={t("faqs", "Everything you need to know")} />
          </div>
        )}

        {mostrar("mensajes") && (
          <div id="firmas" className="scroll-mt-20">
            <LibroDeFirmas
              bodaId={boda.id}
              mensajesIniciales={mensajes}
              titulo={t("mensajes", "Leave us a message")}
              estiloSeparador={estiloSeparador}
            />
          </div>
        )}

        <CompartirWhatsApp nombreBoda={`${boda.nombre_novia} and ${boda.nombre_novio}`} />
      </main>
    </InvitationExperience>
  </WeddingThemeProvider>
);
}
