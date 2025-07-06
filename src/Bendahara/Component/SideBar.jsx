import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt,  FaSignOutAlt, FaUserGraduate, FaMoneyBillWave, FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  // Ambil data profil dari API /me
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:8080/api/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
console.log('res', res)
      setProfile(res.data.data);
    } catch (error) {
      console.error("❌ Gagal mengambil profil:", error);
    }
  };

  fetchProfile();
}, []);


  const handleLogout = () => {
     //localStorage.removeItem("token");
    localStorage.clear();
    toast.success("Berhasil logout");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay hitam untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-green-700 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:inset-0 z-40`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6">Bendahara SDS Taman Harapan</h1>

          {/* Info profil */}
          {profile && (
            <div className="mb-6">
              <p className="text-sm font-semibold">👤 {profile.nama_lengkap}</p>
              <p className="text-xs text-gray-200">{profile.email}</p>
              <hr className="my-3 border-gray-400" />
            </div>
          )}

          {/* Menu navigasi */}
          <ul className="space-y-4">
            <li>
              <Link to="/bendahara/dashboard" className="flex items-center gap-2 hover:text-yellow-300">
                <FaTachometerAlt /> Dashboard
              </Link>
            </li>
             <li>
              <Link to="/bendahara/datasiswa" className="flex items-center gap-2 hover:text-yellow-300">
                <FaUserGraduate /> Data Siswa
              </Link>
            </li>
             <li>
              <Link to="/bendahara/tagihan" className="flex items-center gap-2 hover:text-yellow-300">
                <FaMoneyBillWave /> Tagihan
              </Link>
            </li>
             <li>
              <Link to="/bendahara/periode" className="flex items-center gap-2 hover:text-yellow-300">
                <FaCalendarAlt /> Periode
              </Link>
            </li>
             <li>
              <Link to="/bendahara/laporan" className="flex items-center gap-2 hover:text-yellow-300">
                <FaFileAlt /> Laporan
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-yellow-300 text-white"
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
