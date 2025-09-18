import  {useState} from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {useAuth} from "../hooks/UseAuth.tsx";
import { AiFillFolderOpen } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { AiFillQuestionCircle } from "react-icons/ai";



const navItems = [
  { label: "Home", to: "/", icon:  <AiFillHome className="text-2xl mr-2" />},
  { label: "Learn", to: "/learn", icon: <AiFillFolderOpen  className="text-2xl mr-2" />  },
    { label: "FAQ", to: "/FAQ", icon: <AiFillQuestionCircle  className="text-2xl mr-2" /> },
];

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
    const [openHamburger, setOpenHamburger] = useState(false);

  return (
    <nav className="absolute top-0 left-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="text-3xl font-bold text-slate-800">
            CAMERA101
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex md:justify-center md:items-center md:flex-cols space-x-4">
            {navItems.map((it) => (
                <div className="tooltip tooltip-bottom" data-tip={it.label} key={it.label}>
                    <Link
                        to={it.to}
                        className="p-0 text-black text-xl font-bold text-center flex felx-row content-center items-center hover:text-black transition-colors"
                    >
                        {it.icon}
                    </Link>
                </div>
            ))}
              { isAuthenticated ? (
                  <Link
                      to={"/"}
                      onClick={() => logout()}
                      className="hollow-text text-extrabold leaves-bg text-lg font-bold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-black after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                  >
                      Logout
                  </Link>
              ) : (
                  <>
                      <Link
                          to={"/register"}
                          className="hollow-text text-extrabold leaves-bg text-xl font-bold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-black after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >
                          Register
                      </Link>
                      <Link
                          to={"/login"}
                          className="text-black text-xl font-bold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-black after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >
                          Login
                      </Link>
                  </>
              )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col justify-between items-center"
            onClick={() => setOpenHamburger(!openHamburger)}
          >
            <motion.span
              className="block w-8 h-1 bg-slate-800 rounded"
              animate={openHamburger ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-8 h-1 bg-slate-800 rounded"
              animate={openHamburger ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-8 h-1 bg-slate-800 rounded"
              animate={openHamburger ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {openHamburger && (
            <motion.div
                initial={{height: 0, opacity: 0}}
                animate={{height: "auto", opacity: 1}}
                exit={{height: 0, opacity: 0}}
                transition={{duration: 0.4, ease: "easeInOut"}}
                className="md:hidden"
            >
                <div className="px-10 pt-4 pb-6 space-y-4">
                    {navItems.map((it) => (
                        <Link
                            key={it.label}
                            to={it.to}
                            onClick={() => setOpenHamburger(false)}
                            className=" flex flex-row  items-center text-black hover:text-sky-600 text-lg font-medium"
                        >
                            {it.icon}
                            {it.label}
                        </Link>
                    ))}
                    <Link
                        to={"/"}
                        onClick={() => logout()}
                        className="block text-black hover:text-sky-600 text-lg font-medium"
                    >
                        Logout
                    </Link>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}