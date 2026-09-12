import { FadeIn } from "../FadeIn";

interface SpotifyProps {
  url?: string;
}

export function Spotify({ url }: SpotifyProps) {
  if (!url) return null;

  // Convert regular Spotify URL to embed URL
  const embedUrl = url.replace(
    /(album|playlist|episode|track)\/([a-zA-Z0-9]+)/,
    "embed/$2"
  );

  return (
    <section className="py-16 px-6 bg-secondary/[0.025]">
      <FadeIn>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-serif italic text-black/80">Nuestra Música</h2>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={embedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
