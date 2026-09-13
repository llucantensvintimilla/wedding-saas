"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { EtiquetaSeccion, Ornamento } from "@/components/wedding/Ornamento";
import { FadeIn } from "@/components/FadeIn";
import { FormularioInteres } from "@/components/marketing/FormularioInteres";

const FEATURES = [
  {
    title: "Custom Editorial Design",
    text: "Not a template. A curated visual experience that captures the soul of your relationship.",
    icon: "✧",
  },
  {
    title: "Smart RSVP & Guest Management",
    text: "Zero spreadsheets. An intuitive flow for your guests and a professional dashboard for you.",
    icon: "✧",
  },
  {
    title: "Collaborative Live Gallery",
    text: "Guests upload photos in real-time. You curate and keep them forever in a digital heirloom.",
    icon: "✧",
  },
  {
    title: "The Wedding Timeline",
    text: "From the first invitation to the last dance, a fluid transition of content as the date nears.",
    icon: "✧",
  },
];

const MANIFESTO = [
  {
    title: "Beyond the Template",
    text: "Most wedding sites look like clones. We believe your love story deserves an editorial approach—where whitespace, typography, and photography create a feeling, not just a page.",
  },
  {
    title: "Human Curation",
    text: "Technology does the heavy lifting, but a human eye ensures perfection. Every site is reviewed before delivery to guarantee a premium result.",
  },
  {
    title: "A Digital Heirloom",
    text: "Your website evolves. From the anticipation of the RSVP, to the live excitement of the day, and finally, a beautiful archive of memories.",
  },
];

const PROCESS = [
  { step: "01", title: "Curation", desc: "You share your essence, photos and details through our guided studio." },
  { step: "02", title: "Crafting", desc: "Our designers refine the layout to ensure editorial perfection." },
  { step: "03", title: "Delivery", desc: "Your experience goes live in under 24 hours, ready for the world." },
];

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}

function LandingPageContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const enlaceCrear = ref ? `/crear?ref=${encodeURIComponent(ref)}` : "/crear";

  return (
    <main className="bg-background text-foreground font-body overflow-x-hidden">
      <div className="textura-grano" />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 py-20 overflow-hidden">
        <div className="grid md:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full relative z-10">
          <div className="md:col-span-7 relative">
            <FadeIn>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-xs tracking-[0.4em] uppercase text-primary mb-8 font-medium"
              >
                The Art of Wedding Websites
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-heading text-6xl md:text-8xl leading-[0.9] max-w-3xl mb-10 text-foreground"
              >
                Timeless design <br />
                <span className="italic text-primary">for timeless love.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-black/60 max-w-md text-lg leading-relaxed mb-12"
              >
                A premium editorial experience for couples who value design.
                Ready in 24 hours, curated by hand, and evolved for every moment of your journey.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  href={enlaceCrear}
                  className="inline-block rounded-full bg-foreground text-background px-10 py-5 text-sm font-medium hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Begin your experience →
                </Link>
              </motion.div>
            </FadeIn>
          </div>

          <div className="md:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552"
                alt="Premium Wedding"
                fill
                priority
                sizes="100vw"
                className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
            <div className="absolute -bottom-10 -left-10 bg-white p-6 shadow-xl rounded-lg hidden md:block max-w-[200px] border border-muted">
              <p className="font-heading italic text-xl mb-2">"Pure Elegance"</p>
              <p className="text-xs text-black/40">A curated approach to digital memories.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 px-6 bg-muted/30 border-y border-muted">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            {MANIFESTO.map((item, i) => (
              <FadeIn key={i} delay={i * 150}>
                <h3 className="font-heading text-2xl mb-6">{item.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">
                  {item.text}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROCESS: Visualizing the 24h Promise */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="md:w-1/2">
            <FadeIn>
              <EtiquetaSeccion>The Promise</EtiquetaSeccion>
              <h2 className="font-heading text-4xl md:text-6xl mb-8 leading-tight">
                From vision to <br />
                reality in 24 hours.
              </h2>
              <p className="text-black/50 mb-12 text-lg leading-relaxed">
                We've refined the process to the absolute minimum. You provide the essence,
                we handle the editorial rigor. No back-and-forth, just a perfect result.
              </p>
              <div className="space-y-12">
                {PROCESS.map((p, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 10 }}
                    className="flex gap-6 items-start group"
                  >
                    <span className="font-heading text-3xl text-primary opacity-50 group-hover:opacity-100 transition-opacity">{p.step}</span>
                    <div>
                      <h4 className="font-medium text-lg mb-1">{p.title}</h4>
                      <p className="text-black/50 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
          <div className="md:w-1/2 relative">
             <div className="relative aspect-square w-full overflow-hidden rounded-full border-[16px] border-white shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
                  alt="Wedding Detail"
                  fill
                  className="object-cover"
                />
             </div>
             <div className="absolute -top-10 -right-10 bg-primary text-white p-8 rounded-full w-32 h-32 flex items-center justify-center text-center text-xs font-medium leading-tight shadow-xl">
                The 24h Standard
             </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3">
            <FadeIn>
              <EtiquetaSeccion>The Experience</EtiquetaSeccion>
              <h2 className="font-heading text-4xl md:text-5xl mb-8 leading-tight">
                Designed for the <br />
                modern couple.
              </h2>
              <p className="text-black/50 mb-12 text-lg leading-relaxed">
                We combine cutting-edge technology with editorial rigor to ensure your site is not just a tool, but a reflection of your style.
              </p>
              <Ornamento />
            </FadeIn>
          </div>
          <div className="md:w-2/3 grid sm:grid-cols-2 gap-x-12 gap-y-20">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 100}>
                <div className="group relative p-8 rounded-2xl border border-transparent hover:border-muted transition-all duration-500 hover:bg-muted/20">
                  <span className="text-primary text-2xl mb-4 block">{f.icon}</span>
                  <h3 className="font-heading text-xl mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-black/50 text-sm leading-relaxed">{f.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-32 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <EtiquetaSeccion>Investment</EtiquetaSeccion>
            <h2 className="font-heading text-5xl md:text-7xl mb-12 leading-tight">
              One price. <br />
              Absolute perfection.
            </h2>

            <div className="relative inline-block">
              <div className="rounded-3xl border border-white/20 p-12 md:p-20 bg-white/5 backdrop-blur-sm max-w-md w-full">
                <div className="flex flex-col items-center mb-6">
                  <p className="text-white/40 text-sm line-through tracking-widest uppercase mb-2">Standard Value $1,999</p>
                  <p className="font-heading text-7xl mb-4">$1,499</p>
                </div>
                <p className="text-white/50 text-sm mb-12 tracking-widest uppercase">All-inclusive luxury experience</p>

                <ul className="text-left text-white/70 space-y-4 mb-12 max-w-[240px] mx-auto">
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span> Custom Editorial Design
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span> Full Onboarding Experience
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span> RSVP & Guest Studio
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span> Collaborative Photo Gallery
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span> Delivered in under 24 hours
                  </li>
                </ul>

                <Link
                  href={enlaceCrear}
                  className="block rounded-full bg-background text-foreground py-4 px-8 text-sm font-medium hover:opacity-90 transition-all hover:scale-105"
                >
                  Start your journey →
                </Link>
                <p className="text-white/30 text-xs mt-6">
                  Special partner pricing applied. Custom domain available as an add-on.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 text-center max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-4xl md:text-5xl mb-6">
            Not ready to commit?
          </h2>
          <p className="text-black/50 mb-12 text-lg leading-relaxed">
            Leave your email and we&apos;ll send you our design guide for modern weddings.
          </p>
          <div className="max-w-md mx-auto">
            <FormularioInteres />
          </div>
        </FadeIn>
      </section>

      {/* HIGH-END FOOTER */}
      <footer className="py-20 px-6 border-t border-muted bg-muted/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-heading text-2xl mb-4">OurWeding</h3>
            <p className="text-black/40 text-sm leading-relaxed max-w-xs">
              Curating the digital first impression of your most important day.
              Editorial rigor, human touch, and timeless elegance.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-black/30 font-bold">Explore</h4>
            <ul className="text-sm text-black/60 space-y-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/crear" className="hover:text-primary transition-colors">Build your site</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Design Guide</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-black/30 font-bold">Legal</h4>
            <ul className="text-sm text-black/60 space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-muted/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-black/30 uppercase tracking-widest">
            © {new Date().getFullYear()} OurWeding — Made for Love.
          </p>
          <div className="flex gap-6 text-black/30">
            <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-primary transition-colors">Pinterest</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
