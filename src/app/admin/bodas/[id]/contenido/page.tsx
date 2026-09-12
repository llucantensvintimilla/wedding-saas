import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  anadirCronograma,
  borrarCronograma,
  anadirHotel,
  borrarHotel,
  anadirTransporte,
  borrarTransporte,
  anadirRegalo,
  borrarRegalo,
  anadirFaq,
  borrarFaq,
} from "./actions";

export default async function ContenidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: boda },
    { data: cronograma },
    { data: hoteles },
    { data: transporte },
    { data: regalos },
    { data: faqs },
  ] = await Promise.all([
    supabase.from("bodas").select("nombre_novia, nombre_novio").eq("id", id).single(),
    supabase.from("cronograma").select("*").eq("boda_id", id).order("orden"),
    supabase.from("hoteles").select("*").eq("boda_id", id).order("orden"),
    supabase.from("transporte").select("*").eq("boda_id", id).order("orden"),
    supabase.from("regalos").select("*").eq("boda_id", id).order("orden"),
    supabase.from("faqs").select("*").eq("boda_id", id).order("orden"),
  ]);

  if (!boda) notFound();

  const conId = <T extends (bodaId: string, fd: FormData) => Promise<void>>(fn: T) =>
    fn.bind(null, id);

  return (
    <div className="p-8 max-w-2xl space-y-12">
      <div>
        <Link href="/admin/bodas" className="text-xs text-black/40">
          ← Volver a bodas
        </Link>
        <h1 className="text-xl font-medium mt-2">
          Contenido — {boda.nombre_novia} &amp; {boda.nombre_novio}
        </h1>
      </div>

      {/* CRONOGRAMA */}
      <section>
        <h2 className="text-sm font-medium mb-3">Cronograma</h2>
        <form action={conId(anadirCronograma)} className="flex gap-2 mb-3">
          <input name="hora" placeholder="17:00" required className="w-20 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <input name="titulo" placeholder="Ceremonia" required className="flex-1 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <input name="descripcion" placeholder="Descripción (opcional)" className="flex-1 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <button className="rounded-lg bg-black text-white px-3 text-sm">+</button>
        </form>
        <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
          {cronograma?.map((c) => (
            <div key={c.id} className="p-3 flex items-center justify-between text-sm">
              <span>{c.hora} — {c.titulo}</span>
              <form action={borrarCronograma.bind(null, id, c.id)}>
                <button className="text-xs text-red-500">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* HOTELES */}
      <section>
        <h2 className="text-sm font-medium mb-3">Hoteles</h2>
        <form action={conId(anadirHotel)} className="flex gap-2 mb-3">
          <input name="nombre" placeholder="Nombre del hotel" required className="flex-1 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <input name="enlace" placeholder="Enlace (opcional)" className="flex-1 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <button className="rounded-lg bg-black text-white px-3 text-sm">+</button>
        </form>
        <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
          {hoteles?.map((h) => (
            <div key={h.id} className="p-3 flex items-center justify-between text-sm">
              <span>{h.nombre}</span>
              <form action={borrarHotel.bind(null, id, h.id)}>
                <button className="text-xs text-red-500">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSPORTE */}
      <section>
        <h2 className="text-sm font-medium mb-3">Transporte</h2>
        <form action={conId(anadirTransporte)} className="flex gap-2 mb-3">
          <input name="titulo" placeholder="Bus desde el hotel" required className="flex-1 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <input name="horario" placeholder="18:30" className="w-24 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <button className="rounded-lg bg-black text-white px-3 text-sm">+</button>
        </form>
        <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
          {transporte?.map((t) => (
            <div key={t.id} className="p-3 flex items-center justify-between text-sm">
              <span>{t.titulo} {t.horario && `· ${t.horario}`}</span>
              <form action={borrarTransporte.bind(null, id, t.id)}>
                <button className="text-xs text-red-500">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </section>
      {/* REGALOS */}
      <section>
        <h2 className="text-sm font-medium mb-3">Regalos (lista externa)</h2>
        <p className="text-xs text-black/40 mb-2">
          El Venmo y la transferencia se configuran en la pantalla de
          &quot;Editar&quot; de la boda, no aquí.
        </p>
        <form action={conId(anadirRegalo)} className="flex gap-2 mb-3">
          <input name="titulo" placeholder="Título (ej: Lista de bodas)" required className="flex-1 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <input name="enlace_externo" placeholder="Enlace" className="flex-1 rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <button className="rounded-lg bg-black text-white px-3 text-sm">+</button>
        </form>
        <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
          {regalos?.map((r) => (
            <div key={r.id} className="p-3 flex items-center justify-between text-sm">
              <span>{r.titulo}</span>
              <form action={borrarRegalo.bind(null, id, r.id)}>
                <button className="text-xs text-red-500">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* FAQS */}
      <section>
        <h2 className="text-sm font-medium mb-3">Preguntas frecuentes</h2>
        <form action={conId(anadirFaq)} className="space-y-2 mb-3">
          <input name="pregunta" placeholder="Pregunta" required className="w-full rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <textarea name="respuesta" placeholder="Respuesta" required rows={2} className="w-full rounded-lg border border-black/10 px-2 py-2 text-sm" />
          <button className="rounded-lg bg-black text-white px-3 py-1.5 text-sm">+ Añadir pregunta</button>
        </form>
        <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
          {faqs?.map((f) => (
            <div key={f.id} className="p-3 flex items-center justify-between text-sm">
              <span>{f.pregunta}</span>
              <form action={borrarFaq.bind(null, id, f.id)}>
                <button className="text-xs text-red-500">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
