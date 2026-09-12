import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getBodaPorSlug } from "@/lib/bodas";
import { getFontClassNames, type TipografiaKey } from "@/lib/fonts";
import { PasswordGate } from "./PasswordGate";

export default async function BodaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const boda = await getBodaPorSlug(slug);

  // Si el slug no existe, o la boda existe pero está marcada como
  // inactiva, mostramos un 404 normal en vez de una página vacía o rota.
  if (!boda) notFound();

  const config = (boda.configuracion ?? {}) as {
    color_primario?: string;
    color_secundario?: string;
    color_acento?: string;
    color_fondo?: string;
    tipografia?: TipografiaKey;
    forma?: "nitido" | "suave" | "redondeado";
  };

  // Catálogo cerrado de "forma": cambia el carácter de toda la web
  // de un golpe. OJO: "control" (botones/inputs, formas pensadas
  // para ser una píldora) puede llegar a 9999px, pero "tarjeta"
  // (cajas rectangulares con texto dentro, de alto variable) tiene
  // un tope — si no, con "muy redondeado" una tarjeta rectangular
  // se deforma en un óvalo roto en vez de una esquina redondeada.
  const radios = {
    nitido: { imagen: "2px", control: "4px", tarjeta: "4px" },
    suave: { imagen: "20px", control: "10px", tarjeta: "16px" },
    redondeado: { imagen: "28px", control: "9999px", tarjeta: "28px" },
  }[config.forma ?? "suave"];

  const estiloYFuente = {
    className: getFontClassNames(config.tipografia ?? "elegante"),
    style: {
      "--color-primary": config.color_primario ?? "#b08d57",
      "--color-secondary": config.color_secundario ?? "#2e2e2e",
      "--color-accent": config.color_acento ?? config.color_primario ?? "#b08d57",
      "--background": config.color_fondo ?? "#ffffff",
      "--radio-imagen": radios.imagen,
      "--radio-control": radios.control,
      "--radio-tarjeta": radios.tarjeta,
    } as React.CSSProperties,
  };

  // Si la boda tiene contraseña, comprobamos la cookie de acceso
  // ANTES de renderizar el contenido real. Sin cookie válida, se
  // muestra solo la pantalla de contraseña.
  if (boda.password_acceso) {
    const cookieStore = await cookies();
    const acceso = cookieStore.get(`acceso_${slug}`);
    if (!acceso) {
      return (
        <div {...estiloYFuente}>
          <PasswordGate slug={slug} />
        </div>
      );
    }
  }

  return <div {...estiloYFuente}>
    <div className="textura-grano" />
    {children}
  </div>;
}
