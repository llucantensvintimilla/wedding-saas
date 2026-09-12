import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getCronograma = cache(async (bodaId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cronograma")
    .select("*")
    .eq("boda_id", bodaId)
    .order("orden");
  return data ?? [];
});

export const getHoteles = cache(async (bodaId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hoteles")
    .select("*")
    .eq("boda_id", bodaId)
    .order("orden");
  return data ?? [];
});

export const getTransporte = cache(async (bodaId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transporte")
    .select("*")
    .eq("boda_id", bodaId)
    .order("orden");
  return data ?? [];
});

export const getRegalos = cache(async (bodaId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("regalos")
    .select("*")
    .eq("boda_id", bodaId)
    .order("orden");
  return data ?? [];
});

export const getFaqs = cache(async (bodaId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("boda_id", bodaId)
    .order("orden");
  return data ?? [];
});

export const getGaleriaOficial = cache(async (bodaId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("galeria_oficial")
    .select("*")
    .eq("boda_id", bodaId)
    .order("orden");
  return data ?? [];
});

export const getFotosAprobadas = cache(async (bodaId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("fotos_invitados")
    .select("*")
    .eq("boda_id", bodaId)
    .eq("estado", "aprobada")
    .order("created_at", { ascending: false });
  return data ?? [];
});

export const getMensajesAprobados = cache(async (bodaId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mensajes")
    .select("*")
    .eq("boda_id", bodaId)
    .eq("estado", "aprobado")
    .order("created_at", { ascending: false });
  return data ?? [];
});
