import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudioEditor } from "@/components/studio/StudioEditor";

export default async function EditarPanelPage() {
  const supabase = await createClient();
  const { data: boda } = await supabase.from("bodas").select("*").single();

  if (!boda) notFound();

  return (
    <div className="py-8">
      <StudioEditor boda={boda} />
    </div>
  );
}
