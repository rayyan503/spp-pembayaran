import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nama, setNama] = useState("");

  useEffect(() => {
    const loginFlag = localStorage.getItem("isLoggedIn");
    const userNama = localStorage.getItem("nama");

    setIsLoggedIn(loginFlag === "true");

    if (userNama) {
      setNama(userNama);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-green-600 shadow-md sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">SDS Taman Harapan</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center font-medium">
          {!isLoggedIn ? (
            <>
              <li>
                <a href="#services" className="hover:text-green-200 transition">Layanan</a>
              </li>
              <li>
                <a href="#about" className="hover:text-green-200 transition">Tentang</a>
              </li>
              <li>
                <a
                  href="/login"
                  className="bg-white text-green-600 px-4 py-1 rounded-full hover:bg-green-200 transition"
                >
                  Login
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="text-sm text-white">{nama}</li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-white text-green-600 px-4 py-1 rounded-full hover:bg-green-200 transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-600 px-4 pb-4 space-y-2 shadow-md">
          {!isLoggedIn ? (
            <>
              <a href="#services" className="block hover:text-green-200 transition">Layanan</a>
              <a href="#about" className="block hover:text-green-200 transition">Tentang</a>
              <a
                href="/login"
                className="block bg-white text-green-700 text-center py-2 rounded-full hover:bg-green-200 transition"
              >
                Login
              </a>
            </>
          ) : (
            <>
              <div className="text-white text-center text-sm">{nama}</div>
              <button
                onClick={handleLogout}
                className="block bg-white text-green-700 w-full text-center py-2 rounded-full hover:bg-green-200 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
