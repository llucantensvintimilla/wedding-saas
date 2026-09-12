import { AsistenteCreacion } from "@/components/marketing/AsistenteCreacion";

export default async function CrearPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <main className="bg-[#faf7f2] text-[#1a1a1a] min-h-screen py-20 px-6">
      <AsistenteCreacion codigoReferido={ref} />
    </main>
  );
}
