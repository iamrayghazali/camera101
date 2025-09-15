import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "ghazali.raydan@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-200 py-6 mt-auto relative shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left - Brand */}
        <div className="mb-4 md:mb-0 text-lg font-bold">Brand</div>

        {/* Center - Made by + email */}
        <div className="text-center">
          <p>
            made by |{" "}
            <a
              href="https://raydandev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="italic font-bold hover:text-sky-400 transition-colors"
            >
              this guy
            </a>
          </p>
          <button
            onClick={handleCopy}
            className="mt-2 text-sm text-slate-300 hover:text-sky-400 transition-colors"
          >
            {email}
          </button>
        </div>

        {/* Right - 3 items (all copy email) */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={handleCopy}
              className="text-slate-300 hover:text-sky-400 transition-colors text-sm"
            >
              Item {n}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-2 right-2 bg-sky-600 text-white px-3 py-1 rounded-lg text-sm shadow-lg"
          >
            copied!
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}