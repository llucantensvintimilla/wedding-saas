"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StudioLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Invalid email or password.");
      return;
    }

    router.refresh();
    router.push("/studio");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf7f2]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-8 rounded-3xl border border-black/5 p-10 bg-white shadow-sm"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-serif italic text-black/80">
            Couple's Studio
          </h1>
          <p className="text-xs uppercase tracking-widest text-black/40">Sign in to your atelier</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-black/60 font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-gold outline-none transition-colors bg-[#faf7f2]/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] uppercase tracking-widest text-black/60 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-gold outline-none transition-colors bg-[#faf7f2]/50"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center italic">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-black text-white py-4 text-sm font-medium hover:bg-charcoal transition-all active:scale-95 disabled:opacity-50 shadow-lg"
        >
          {loading ? "Authenticating..." : "Enter Studio"}
        </button>
      </form>
    </div>
  );
}
