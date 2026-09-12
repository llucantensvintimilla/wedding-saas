import { createClient } from "@/lib/supabase/server";
import { crearBoda } from "../actions";

export default async function NuevaBodaPage() {
  const supabase = await createClient();
  const { data: colaboradores } = await supabase
    .from("colaboradores")
    .select("id, nombre")
    .order("nombre");

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-xl font-medium mb-1">New Wedding</h1>
      <p className="text-sm text-black/50 mb-6">
        Only the essentials to get started. The rest (colors, texts, photos...)
        will be filled in later, in the editor screen.
      </p>

      <form action={crearBoda} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-black/60">
            Slug — e.g. laura-alberto
          </label>
          <input
            name="slug"
            required
            pattern="[a-z0-9\-]+"
            title="Only lowercase, numbers and dashes"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-black/60">Bride's Name</label>
            <input
              name="nombre_novia"
              required
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-black/60">Groom's Name</label>
            <input
              name="nombre_novio"
              required
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-black/60">Wedding Date</label>
          <input
            name="fecha_boda"
            type="date"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-black/60">Partner</label>
          <select
            name="colaborador_id"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          >
            <option value="">Unassigned</option>
            {colaboradores?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium"
        >
          Create Wedding
        </button>
      </form>
    </div>
  );
}
