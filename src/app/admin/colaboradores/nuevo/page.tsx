import { crearColaborador } from "../actions";

export default function NuevoColaboradorPage() {
  return (
    <div className="p-8 max-w-md">
      <h1 className="text-xl font-medium mb-6">Nuevo colaborador</h1>

      <form action={crearColaborador} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-black/60">Nombre</label>
          <input
            name="nombre"
            required
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-black/60">Tipo</label>
          <select
            name="tipo"
            required
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          >
            <option value="fotografo">Fotógrafo</option>
            <option value="wedding_planner">Wedding planner</option>
            <option value="finca">Finca</option>
            <option value="videografo">Videógrafo</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-black/60">Email de contacto</label>
          <input
            name="email_contacto"
            type="email"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium"
        >
          Crear colaborador
        </button>
      </form>
    </div>
  );
}
