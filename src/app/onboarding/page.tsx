"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";

const onboardingSchema = z.object({
  // Step 1: Identity
  nombre_novia: z.string().min(2, "Name is required"),
  nombre_novio: z.string().min(2, "Name is required"),
  email_novia: z.string().email("Invalid email"),
  email_novio: z.string().email("Invalid email"),

  // Step 2: Vision
  historia_pareja: z.string().min(10, "Please share a bit more about your story"),

  // Step 3: Curation
  luxury_preset: z.enum(["gold_minimal", "floral_classic", "modern_dark"]),
  animation_level: z.enum(["subtle", "dynamic", "high"]),

  // Step 4: Logistics
  fecha_boda: z.string().min(1, "Wedding date is required"),
  preferred_domain: z.string().min(1, "Preferred domain is required"),
  inspiration_links: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);

  useEffect(() => {
    async function checkPayment() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: paidOrder, error } = await supabase
          .from("orders")
          .select("id")
          .eq("customer_email", user.email!)
          .eq("status", "paid")
          .maybeSingle();

        if (error || !paidOrder) {
          router.push("/pricing");
        }
      } catch (err) {
        console.error("Payment check error:", err);
        router.push("/pricing");
      } finally {
        setIsCheckingPayment(false);
      }
    }
    checkPayment();
  }, [supabase, router]);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    const fieldsToValidate: Record<number, (keyof OnboardingFormValues)[]> = {
      1: ["nombre_novia", "nombre_novio", "email_novia", "email_novio"],
      2: ["historia_pareja"],
      3: ["luxury_preset", "animation_level"],
      4: ["fecha_boda", "preferred_domain"],
    };

    const fields = fieldsToValidate[step];
    if (fields) {
      const isValid = await trigger(fields);
      if (!isValid) return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // 1. Find the placeholder Boda created by the webhook
      const { data: bodaPlaceholder, error: bodaFetchError } = await supabase
        .from("bodas")
        .select("id")
        .eq("acceso_email", user.email!)
        .maybeSingle();

      if (bodaFetchError) throw bodaFetchError;

      if (!bodaPlaceholder) {
        throw new Error("Wedding record not found. Please contact support.");
      }

      // 2. Update the placeholder Boda with onboarding data
      const { error: updateError } = await supabase
        .from("bodas")
        .update({
          nombre_novia: data.nombre_novia,
          nombre_novio: data.nombre_novio,
          fecha_boda: data.fecha_boda,
          historia_pareja: data.historia_pareja,
          configuracion: {
            luxury_preset: data.luxury_preset,
            animation_level: data.animation_level,
          },
          activa: true,
          production_status: "onboarding_completed",
        })
        .eq("id", bodaPlaceholder.id);

      if (updateError) throw updateError;

      // 3. Ensure role is correctly set
      const { error: profileError } = await supabase
        .from("perfiles")
        .update({
          rol: "novios",
          boda_id: bodaPlaceholder.id
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 4. Add to delivery queue (if not already there)
      await supabase
        .from("delivery_queue")
        .upsert({
          user_id: user.id,
          boda_id: bodaPlaceholder.id,
          status: "pending",
        }, { onConflict: 'user_id' });

      router.push("/payment-success");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingPayment) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <p className="text-black/40 italic animate-pulse">Verifying your luxury experience...</p>
      </div>
    );
  }

  const progress = ((step - 1) / 4) * 100;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-charcoal font-body flex flex-col">
      {/* Luxury Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-black/5 z-50">
        <motion.div
          className="h-full bg-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ backgroundColor: "#b08d57" }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-xl space-y-12">
          <header className="text-center space-y-3">
            <h1 className="text-4xl font-serif italic text-black/80">Curating Your Experience</h1>
            <p className="text-black/50 italic">Step {step} of 5</p>
          </header>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="space-y-8"
              >
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-black/40">Bride's Name</label>
                      <input {...register("nombre_novia")} className="w-full bg-transparent border-b border-black/10 py-2 focus:border-gold outline-none transition-colors" />
                      {errors.nombre_novia && <p className="text-xs text-red-500">{errors.nombre_novia.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-black/40">Groom's Name</label>
                      <input {...register("nombre_novio")} className="w-full bg-transparent border-b border-black/10 py-2 focus:border-gold outline-none transition-colors" />
                      {errors.nombre_novio && <p className="text-xs text-red-500">{errors.nombre_novio.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-black/40">Bride's Email</label>
                      <input {...register("email_novia")} type="email" className="w-full bg-transparent border-b border-black/10 py-2 focus:border-gold outline-none transition-colors" />
                      {errors.email_novia && <p className="text-xs text-red-500">{errors.email_novia.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-black/40">Groom's Email</label>
                      <input {...register("email_novio")} type="email" className="w-full bg-transparent border-b border-black/10 py-2 focus:border-gold outline-none transition-colors" />
                      {errors.email_novio && <p className="text-xs text-red-500">{errors.email_novio.message}</p>}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <label className="text-sm italic text-black/60">Tell us the story of your union. We use this to craft the narrative of your site.</label>
                    <textarea
                      {...register("historia_pareja")}
                      rows={6}
                      className="w-full bg-transparent border border-black/10 rounded-xl p-4 focus:border-gold outline-none transition-colors resize-none"
                    />
                    {errors.historia_pareja && <p className="text-xs text-red-500">{errors.historia_pareja.message}</p>}
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm italic text-black/60">Which aesthetic resonates with you most?</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["gold_minimal", "floral_classic", "modern_dark"].map((preset) => (
                          <label key={preset} className="cursor-pointer group">
                            <input type="radio" {...register("luxury_preset")} value={preset} className="hidden peer" />
                            <div className="p-4 border border-black/10 rounded-xl peer-checked:border-gold peer-checked:bg-gold/5 transition-all text-center group-hover:border-gold/50">
                              <span className="text-sm capitalize">{preset.replace("_", " ")}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm italic text-black/60">Animation intensity</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["subtle", "dynamic", "high"].map((level) => (
                          <label key={level} className="cursor-pointer group">
                            <input type="radio" {...register("animation_level")} value={level} className="hidden peer" />
                            <div className="p-4 border border-black/10 rounded-xl peer-checked:border-gold peer-checked:bg-gold/5 transition-all text-center group-hover:border-gold/50">
                              <span className="text-sm capitalize">{level}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-black/40">Wedding Date</label>
                      <input {...register("fecha_boda")} type="date" className="w-full bg-transparent border-b border-black/10 py-2 focus:border-gold outline-none transition-colors" />
                      {errors.fecha_boda && <p className="text-xs text-red-500">{errors.fecha_boda.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-black/40">Preferred Domain (e.g. sarahandtom.com)</label>
                      <input {...register("preferred_domain")} className="w-full bg-transparent border-b border-black/10 py-2 focus:border-gold outline-none transition-colors" />
                      {errors.preferred_domain && <p className="text-xs text-red-500">{errors.preferred_domain.message}</p>}
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-xs uppercase tracking-widest text-black/40">Inspiration Links (Pinterest, etc.)</label>
                      <input {...register("inspiration_links")} className="w-full bg-transparent border-b border-black/10 py-2 focus:border-gold outline-none transition-colors" />
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6 text-center">
                    <h3 className="text-2xl font-serif italic">Review Your Details</h3>
                    <div className="text-left bg-white/50 p-8 rounded-2xl border border-black/5 space-y-4 text-sm">
                      <p><strong>Couple:</strong> {getValues("nombre_novia")} & {getValues("nombre_novio")}</p>
                      <p><strong>Date:</strong> {getValues("fecha_boda")}</p>
                      <p><strong>Style:</strong> {getValues("luxury_preset")} ({getValues("animation_level")})</p>
                      <p><strong>Domain:</strong> {getValues("preferred_domain")}</p>
                    </div>
                    <p className="text-sm italic text-black/50">Please ensure all details are correct before finalizing.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center pt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="text-sm text-black/40 hover:text-black transition-colors disabled:opacity-0"
            >
              Back
            </button>

            {step < 5 ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-charcoal transition-all active:scale-95"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="px-12 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-charcoal transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Finalizing..." : "Complete Onboarding"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
