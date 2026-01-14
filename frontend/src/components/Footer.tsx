
export default function Footer() {

  return (
    <footer className="w-full bg-black text-slate-200 py-6 mt-auto relative shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left - Brand */}
        <div className="mb-4 md:mb-0 text-lg font-rama font-bold">Learn Camera 101</div>

        {/* Center - Made by + Rights served */}
        <div className="text-center">
          <p className="font-rama">
            made by |{" "}
            <a
              href="https://raydandev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="italic font-rama font-bold hover:text-sky-400 transition-colors"
            >
              this guy
            </a>
          </p>
          <p
            className="mt-2 text-sm font-rama text-slate-300 "
          >
            © 2025 CAMERA101. All rights reserved.
          </p>
        </div>
            {/* Placeholder */}
          <div></div>
      </div>
    </footer>
  );
}