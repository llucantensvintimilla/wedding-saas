import "server-only";
import { Resend } from "resend";

// OJO: el cliente se crea DENTRO de cada función que lo usa, no aquí
// arriba. Si se creara aquí (a nivel de módulo) y faltara la clave,
// fallaría en el instante en que CUALQUIER archivo que importe este
// helper se cargue -- tumbando páginas enteras que ni siquiera
// llegan a mandar un email. Creándolo bajo demanda, un fallo aquí
// queda contenido dentro del try/catch de cada función.
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Mientras no verifiques tu propio dominio en Resend, este remitente
// de pruebas ("onboarding@resend.dev") funciona sin configuración,
// pero solo entrega al email con el que te registraste en Resend.
// En cuanto verifiques tu dominio, cambia esto por algo como
// "Vuestra Boda <hola@tudominio.com>".
const REMITENTE = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

function plantillaAcceso({
  titulo,
  texto,
  enlace,
  textoBoton,
}: {
  titulo: string;
  texto: string;
  enlace: string;
  textoBoton: string;
}) {
  return `
  <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
    <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #b08d57; text-align: center; margin-bottom: 24px;">
      Your wedding website
    </p>
    <h1 style="font-size: 24px; text-align: center; margin-bottom: 16px; font-weight: 500;">
      ${titulo}
    </h1>
    <p style="font-size: 14px; line-height: 1.6; color: #555; text-align: center; margin-bottom: 32px;">
      ${texto}
    </p>
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${enlace}"
         style="background: #1a1a1a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 14px; display: inline-block;">
        ${textoBoton}
      </a>
    </div>
    <p style="font-size: 11px; color: #999; text-align: center;">
      If the button doesn't work, copy and paste this link into your browser:<br/>
      <span style="word-break: break-all;">${enlace}</span>
    </p>
  </div>`;
}

export async function enviarEmailAccesoNovios({
  to,
  nombrePareja,
  enlace,
}: {
  to: string;
  nombrePareja: string;
  enlace: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY no está configurada; email no enviado.");
      return { ok: false };
    }
    await getResend().emails.send({
      from: REMITENTE,
      to,
      subject: `You now have access to your website, ${nombrePareja}!`,
      html: plantillaAcceso({
        titulo: `Congratulations, ${nombrePareja} 🤍`,
        texto: "Your wedding website has been created. Log in to set your password and start personalizing it.",
        enlace,
        textoBoton: "Go to my dashboard",
      }),
    });
    return { ok: true };
  } catch {
    // No hacemos que falle todo el flujo si el email no sale: el
    // enlace ya se muestra igualmente en el panel como respaldo.
    return { ok: false };
  }
}

export async function enviarEmailAccesoAfiliado({
  to,
  nombre,
  enlace,
}: {
  to: string;
  nombre: string;
  enlace: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY no está configurada; email no enviado.");
      return { ok: false };
    }
    await getResend().emails.send({
      from: REMITENTE,
      to,
      subject: "You now have access to your affiliate dashboard",
      html: plantillaAcceso({
        titulo: `Hi, ${nombre}`,
        texto: "You can now log in to your affiliate dashboard to see your referral code and commissions.",
        enlace,
        textoBoton: "Go to my dashboard",
      }),
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
