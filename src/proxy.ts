import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Se ejecuta antes de cada peticion a /admin/* o /panel/*.
 *
 * Ahora que hay dos roles (admin y novios), no basta con comprobar
 * si hay sesion: hay que comprobar tambien el ROL de esa sesion, y
 * mandar a cada quien a la zona que le corresponde. Las politicas
 * RLS de la base de datos ya impiden que un rol equivocado toque
 * datos ajenos, pero aqui reforzamos la experiencia: que ni siquiera
 * VEAN una pantalla que no es la suya.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const esRutaAdmin = pathname.startsWith("/admin");
  const esRutaPanel = pathname.startsWith("/panel");
  const esRutaAfiliado = pathname.startsWith("/afiliado");
  const esLoginAdmin = pathname === "/admin/login";
  const esLoginPanel = pathname === "/panel/login";
  const esLoginAfiliado = pathname === "/afiliado/login";

  // Sin sesion: a cada zona le corresponde su propio login
  if (!user) {
    if (esRutaAdmin && !esLoginAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (esRutaPanel && !esLoginPanel) {
      return NextResponse.redirect(new URL("/panel/login", request.url));
    }
    if (esRutaAfiliado && !esLoginAfiliado) {
      return NextResponse.redirect(new URL("/afiliado/login", request.url));
    }
    return response;
  }

  // Con sesion: miramos el rol una sola vez y decidimos
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  const esAdmin = perfil?.rol === "admin";
  const esNovios = perfil?.rol === "novios";
  const esAfiliado = perfil?.rol === "afiliado";

  if (esRutaAdmin) {
    if (!esAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (esLoginAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (esRutaPanel) {
    if (!esNovios) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (esLoginPanel) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  if (esRutaAfiliado) {
    if (!esAfiliado) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (esLoginAfiliado) {
      return NextResponse.redirect(new URL("/afiliado", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*", "/afiliado/:path*"],
};
