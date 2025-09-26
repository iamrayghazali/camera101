import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="mb-6">
            <h1 className="text-4xl font-rama font-bold text-gray-900 mb-2">
              404
            </h1>
            <p className="text-lg text-gray-600">
              Page not found
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-500">
              The page you're looking for doesn't exist. Let's get you back on track!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                to="/"
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <AiOutlineHome className="text-lg" />
                Go Home
              </Link>
              <Link
                to="/learn"
                className="btn btn-outline text-primary flex-1 flex items-center justify-center gap-2"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
      
    </div>
  );
}