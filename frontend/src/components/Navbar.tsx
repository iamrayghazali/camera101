import  {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {useAuth} from "../hooks/UseAuth.tsx";
import { AiFillFolderOpen } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { AiFillQuestionCircle } from "react-icons/ai";
import { MdOutlinePhoneIphone } from "react-icons/md";

// Animation variants
const fadeDown = {
    initial: { opacity: 0, y: -60 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1], // smooth ease curve
            delay: 0.3
        }
    }
};

const navItems = [
  { label: "Home", to: "/", icon:  <AiFillHome className="text-2xl mr-2" />},
  { label: "Learn", to: "/learn", icon: <AiFillFolderOpen  className="text-2xl mr-2" />  },
  { label: "iPhone Simulator", to: "/simulators/iphone", icon: <MdOutlinePhoneIphone  className="text-2xl mr-2" /> }, // ✅ Added iPhone Simulator button
  { label: "FAQ", to: "/FAQ", icon: <AiFillQuestionCircle  className="text-2xl mr-2" /> },
];

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [openHamburger, setOpenHamburger] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <nav className={`${isHomePage ? 'bg-transparent' : 'bg-white'} backdrop-blur-sm absolute top-0 left-0 w-full z-50 shadow-sm`}>
      <motion.div
          initial="initial"
          animate="animate"
          variants={fadeDown}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16">

          <Link to="/" className={`text-3xl font-baby ${isHomePage ? 'text-primary drop-shadow-lg' : 'text-slate-800'}`}>
            LEARN CAMERA
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex md:justify-center md:items-center md:flex-cols space-x-4">
            {navItems.map((it) => (
                <div className="tooltip tooltip-bottom" data-tip={it.label} key={it.label}>
                    <Link
                        to={it.to}
                        className={`p-0 text-xl font-rama font-bold text-center flex felx-row content-center items-center transition-all duration-300 ${isHomePage ? 'text-white hover:text-white/80 drop-shadow-md hover:drop-shadow-lg' : 'text-black hover:text-black hover:scale-105'}`}
                    >
                        {it.icon}
                    </Link>
                </div>
            ))}
              { isAuthenticated ? (
                  <Link
                      to={"/"}
                      onClick={() => logout()}
                      className={`text-lg font-rama font-bold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100 ${isHomePage ? 'text-white after:bg-white' : 'text-black after:bg-black'}`}
                  >
                      Logout
                  </Link>
              ) : (
                  <>
                      <Link
                          to={"/register"}
                          className={`text-xl font-rama font-bold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100 ${isHomePage ? 'text-white after:bg-white' : 'text-black after:bg-black'}`}
                      >
                          Register
                      </Link>
                      <Link
                          to={"/login"}
                          className={`text-xl font-rama font-bold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100 ${isHomePage ? 'text-white after:bg-white' : 'text-black after:bg-black'}`}
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
              className={`block w-8 h-1 rounded ${isHomePage ? 'bg-white' : 'bg-slate-800'}`}
              animate={openHamburger ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className={`block w-8 h-1 rounded ${isHomePage ? 'bg-white' : 'bg-slate-800'}`}
              animate={openHamburger ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className={`block w-8 h-1 rounded ${isHomePage ? 'bg-white' : 'bg-slate-800'}`}
              animate={openHamburger ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.div>

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
                            className={`flex flex-row items-center text-lg font-rama font-medium ${isHomePage ? 'text-white hover:text-white/80' : 'text-black hover:text-sky-600'}`}
                        >
                            {it.icon}
                            {it.label}
                        </Link>
                    ))}
                    { isAuthenticated ? (
                        <Link
                            to={"/"}
                            onClick={() => logout()}
                            className={`block text-lg font-rama font-medium ${isHomePage ? 'text-white hover:text-white/80' : 'text-black hover:text-sky-600'}`}
                        >
                            Logout
                        </Link>
                    ) : (
                        <>
                            <Link
                                to={"/login"}
                                onClick={() => logout()}
                                className={`block text-lg font-rama font-medium ${isHomePage ? 'text-white hover:text-white/80' : 'text-black hover:text-sky-600'}`}
                            >
                                Login
                            </Link>
                            <Link
                                to={"/register"}
                                onClick={() => logout()}
                                className={`block text-lg font-rama font-medium ${isHomePage ? 'text-white hover:text-white/80' : 'text-black hover:text-sky-600'}`}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}