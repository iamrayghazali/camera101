import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-6xl font-extrabold text-slate-800 mb-4"
      >
        Oops!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-lg text-slate-600 mb-6"
      >
        Page not found.  
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Link
          to="/"
          className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow"
        >
          Go back home
        </Link>
      </motion.div>
    </div>
      <Footer />
    </div>
  );
}