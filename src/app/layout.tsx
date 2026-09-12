import type { Metadata } from "next";
import { getFontClassNames } from "@/lib/fonts";
import "./globals.css";
import { Suspense } from "react";
import ReferralCapture from "@/components/ReferralCapture";

export const metadata: Metadata = {
  title: "Custom wedding websites — ready in 24h",
  description:
    "Editorial design, real RSVP, a collaborative photo gallery, and your own dashboard to edit it yourselves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${getFontClassNames("elegante")} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <ReferralCapture />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
