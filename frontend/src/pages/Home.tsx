import {Link} from "react-router-dom";
import {useAuth} from "../hooks/UseAuth.tsx";

export default function Home() {
    const { isAuthenticated } = useAuth();

  return (
      <>
              <main id="bg-img" className={`flex flex-col justify-center items-center w-full h-screen font-fira `}>
          { isAuthenticated ? (
              <>
              {/*TODO SHOW STATS OF COURSES*/}
              </>
          ) : (
              <>
                  <h1 className=" text-black font-black text-5xl md:text-6xl p-5 text-center font-boldie leading-relaxed ">Take Your <br/><span className="  leaves-bg hollow-text leading-relaxed text-green-600 text-5xl md:text-7xl">CAMERA SKILLS</span><br/> to the Next Level.</h1>
                  <Link to="" className="mt-20"> {/*//TODO*/}
                      <a className=" rounded-xl leaves-bg px-5 py-2 text-2xl text-white font-bold">Start Learning</a>
                  </Link>
              </>
          )}
              </main>
      </>
  );
}