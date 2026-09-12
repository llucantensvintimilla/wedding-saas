import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import { WeddingThemeProvider } from "@/components/wedding/WeddingThemeProvider";

export default function SuccessPage() {
  return (
    <WeddingThemeProvider preset="gold_minimal" animation="subtle">
      <main className="bg-[#faf7f2] text-[#1a1a1a] min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center">
        <FadeIn>
          <h1 className="font-heading text-4xl md:text-6xl mb-6">Payment received! 🤍</h1>
          <p className="text-black/60 max-w-lg mx-auto mb-10 text-lg">
            Thank you for trusting us with your big day. We&apos;re now starting the
            final human review of your website to make sure everything is perfect.
          </p>
          <div className="bg-white border border-black/10 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
            <p className="font-medium mb-4">What happens next?</p>
            <ul className="text-sm text-black/50 space-y-3 text-left mb-8">
              <li>✓ Your wedding data is saved.</li>
              <li>✓ Our team is reviewing the design.</li>
              <li>✓ You&apos;ll receive an email within 24 hours with your dashboard access.</li>
            </ul>
            <Link
              href="/"
              className="inline-block rounded-full bg-black text-white px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Back to home
            </Link>
          </div>
        </FadeIn>
      </main>
    </WeddingThemeProvider>
  );
}
