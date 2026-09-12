"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateWeddingContent } from "@/app/studio/actions";

export function StudioEditor({ boda }: { boda: any }) {
  const [activeTab, setActiveTab] = useState<"info" | "visual" | "content">("info");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const config = (boda.configuracion ?? {}) as Record<string, any>;

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setSaved(false);

    // Extract updates from formData
    const updates: any = {};
    formData.forEach((value, key) => {
      // We skip the specific config fields to handle them separately as a merged JSONB object
      if (key !== "luxury_preset" && key !== "animation_level") {
        updates[key] = value;
      }
    });

    // Handle the configuration JSONB merge
    const configUpdates: any = {};
    const preset = formData.get("luxury_preset");
    const level = formData.get("animation_level");

    if (preset) configUpdates.luxury_preset = preset;
    if (level) configUpdates.animation_level = level;

    // Merge with existing config to avoid wiping out other settings (like titulos, etc)
    const finalConfig = { ...config, ...configUpdates };
    updates.configuracion = finalConfig;

    try {
      const result = await updateWeddingContent(boda.id, updates);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e: any) {
      alert(e.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Navigation */}
        <div className="md:w-64 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-black/30 font-bold px-4 mb-4 mt-8">
            Studio Sections
          </div>
          {[
            { id: "info", label: "Core Details", desc: "The basics of your wedding" },
            { id: "visual", label: "Visual Identity", desc: "Colors, fonts and style" },
            { id: "content", label: "Story & Logistics", desc: "The narrative of your day" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                ? "bg-white shadow-sm border border-black/10 text-foreground font-medium"
                : "text-black/40 hover:text-black hover:bg-muted/30"
              }`}
            >
              <span className="block text-sm">{tab.label}</span>
              <span className="block text-[10px] opacity-60">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1">
          <form action={handleSubmit} className="bg-white p-8 rounded-3xl border border-muted shadow-sm relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {activeTab === "info" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-heading text-3xl mb-2">Core Details</h2>
                      <p className="text-black/50 text-sm mb-8">The fundamental information of your wedding.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">Partner One</label>
                        <input name="nombre_novia" defaultValue={boda.nombre_novia} required
                          className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">Partner Two</label>
                        <input name="nombre_novio" defaultValue={boda.nombre_novio} required
                          className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors" />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">The Date</label>
                        <input name="fecha_boda" type="date" defaultValue={boda.fecha_boda ?? ""}
                          className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "visual" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-heading text-3xl mb-2">Visual Identity</h2>
                      <p className="text-black/50 text-sm mb-8">Define the aesthetic that will guide your guests.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">Visual Preset</label>
                        <div className="grid grid-cols-1 gap-3">
                          {["gold_minimal", "floral_classic", "modern_dark"].map((preset) => (
                            <label key={preset} className="flex items-center gap-3 p-3 border border-black/10 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                              <input
                                type="radio"
                                name="luxury_preset"
                                value={preset}
                                defaultChecked={config.luxury_preset === preset}
                                className="accent-primary"
                              />
                              <span className="text-sm capitalize">{preset.replace("_", " ")}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">Animation Intensity</label>
                        <div className="grid grid-cols-1 gap-3">
                          {["subtle", "dynamic", "high"].map((level) => (
                            <label key={level} className="flex items-center gap-3 p-3 border border-black/10 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                              <input
                                type="radio"
                                name="animation_level"
                                value={level}
                                defaultChecked={config.animation_level === level}
                                className="accent-primary"
                              />
                              <span className="text-sm capitalize">{level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-heading text-3xl mb-2">Story & Logistics</h2>
                      <p className="text-black/50 text-sm mb-8">The narrative and practical details of your celebration.</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">Our Story</label>
                        <textarea name="historia_pareja" defaultValue={boda.historia_pareja ?? ""} rows={4}
                          className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors resize-none" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">Ceremony Location</label>
                          <input name="ubicacion_ceremonia" defaultValue={boda.ubicacion_ceremonia ?? ""}
                            className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">Reception Location</label>
                          <input name="ubicacion_celebracion" defaultValue={boda.ubicacion_celebracion ?? ""}
                            className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-black/40 block ml-1">Dress Code</label>
                        <input name="dress_code" defaultValue={boda.dress_code ?? ""}
                          className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden fields to preserve existing data */}
                <input type="hidden" name="colaborador_id" value={boda.colaborador_id ?? ""} />
                {boda.activa && <input type="hidden" name="activa" value="on" />}
                <input type="hidden" name="password_acceso" value={boda.password_acceso ?? ""} />
                <input type="hidden" name="foto_secundaria_url" value={boda.foto_secundaria_url ?? ""} />
                <input type="hidden" name="spotify_playlist_url" value={boda.spotify_playlist_url ?? ""} />
                <input type="hidden" name="bizum_numero" value={boda.bizum_numero ?? ""} />
                <input type="hidden" name="datos_transferencia" value={boda.datos_transferencia ?? ""} />
                <input type="hidden" name="lat" value={boda.lat ?? ""} />
                <input type="hidden" name="lng" value={boda.lng ?? ""} />
                <input type="hidden" name="hero_overlay" value={config.hero_overlay ?? "oscuro"} />
                <input type="hidden" name="estilo_separador" value={config.estilo_separador ?? "linea"} />
                {(config.paleta_dresscode as unknown as string[] ?? []).map((c, i) => (
                  <input key={i} type="hidden" name="paleta_dresscode" value={c} />
                ))}
                {Object.entries((config.titulos as unknown as Record<string, string>) ?? {}).map(
                  ([clave, valor]) => (
                    <input key={clave} type="hidden" name={`titulo_${clave}`} value={valor} />
                  )
                )}
                {Object.entries(
                  (config.secciones_visibles as unknown as Record<string, boolean>) ?? {}
                )
                  .filter(([, visible]) => visible !== false)
                  .map(([clave]) => (
                    <input key={clave} type="hidden" name={`mostrar_${clave}`} value="on" />
                  ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex items-center justify-end gap-4">
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-green-600 font-medium"
                >
                  Changes saved successfully
                </motion.span>
              )}
              <button
                disabled={isSaving}
                className="px-8 py-3 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all shadow-lg"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
