import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Item 1", to: "/" },
  { label: "Item 2", to: "/#2" },
  { label: "Item 3", to: "/#3" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="text-xl font-bold text-slate-800">
            Brand
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((it) => (
              <Link
                key={it.label}
                to={it.to}
                className="text-slate-800 hover:text-sky-600 transition-colors"
              >
                {it.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col justify-between items-center"
            onClick={() => setOpen(!open)}
          >
            <motion.span
              className="block w-8 h-1 bg-slate-800 rounded"
              animate={open ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-8 h-1 bg-slate-800 rounded"
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-8 h-1 bg-slate-800 rounded"
              animate={open ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              {navItems.map((it) => (
                <Link
                  key={it.label}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className="block text-slate-800 hover:text-sky-600 text-lg font-medium"
                >
                  {it.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}