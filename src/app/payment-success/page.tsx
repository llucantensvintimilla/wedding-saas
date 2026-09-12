import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-charcoal flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        <header className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif italic text-black/80 leading-tight">
            Your journey has begun.
          </h1>
          <div className="w-12 h-[1px] bg-gold mx-auto" style={{ backgroundColor: "#b08d57" }} />
        </header>

        <div className="space-y-8">
          <p className="text-lg md:text-xl text-black/60 leading-relaxed font-light">
            We have received your details. Our curators are now preparing your digital experience,
            ensuring every detail reflects the unique essence of your union.
          </p>
          <p className="text-md text-black/40 italic">
            Your personalized access link will be delivered to your inbox within the next 24 hours.
          </p>
        </div>

        <footer className="pt-12">
          <p className="text-xs uppercase tracking-[0.2em] text-black/30 font-medium">
            Thank you for choosing the Wedding Atelier
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
