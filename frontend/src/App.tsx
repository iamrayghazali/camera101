import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CheckoutButton from "./components/CheckoutButton.tsx";
import {useAuth} from "./hooks/UseAuth.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import LessonCategories from "./components/LessonCategories.tsx";


function App() {
    const { token, user, logout, isAuthenticated } = useAuth();
    const navigate  = useNavigate();

    useEffect(() => {
        if (token) {
            console.log("Token:", token);
            console.log("logged in", user);
        }
        else {
            console.log("not l in", user);
            console.log("Token:", token);
        }
    }, [token, navigate])

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
        <Home />
        <section className="h-screen bg-red-500">

        </section>
        <section className="flex flex-col justify-center items-center min-h-screen bg-black">
            <LessonCategories />
        </section>
          {!token ? (
              <div className="space-y-6">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={() => navigate("/register")}>REGISTER</button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={() => navigate("/login")}>LOGIN</button>
              </div>
          ) : (
              <div className="space-y-4 bg-green-500 min-h-screen">
                  <p className="text-lg font-medium">Welcome, {user.username}</p>
                  <CheckoutButton jwtToken={token} />
                  {isAuthenticated && (
                      <>
                          <button
                              onClick={handleLogout}
                              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
                          >
                              Logout
                          </button>
                      </>
                  )}
              </div>
          )}
      <Footer />
    </div>
  )
}

export default App
