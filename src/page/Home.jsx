import React from "react";
import { FaCreditCard } from "react-icons/fa";
import LogoSekolah from "../assets/logo.jpg";
import Navbar from "../Component/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-100 py-10 px-6 text-center">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-left space-y-4 md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
              Pembayaran SPP Lebih Mudah dan Cepat
            </h2>
            <p className="text-gray-700">
              Kelola pembayaran SPP siswa dengan aman dan efisien melalui sistem online SDS Taman Harapan.
            </p>
            <a
              href="/login"
              className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Mulai Sekarang
            </a>
          </div>
          <img
            src={LogoSekolah}
            alt="Logo Sekolah"
            className="mt-6 md:mt-0 w-3/4 md:w-[250px] max-w-full object-contain rounded-lg shadow-md"
          />
        </div>
      </section>

      {/* Layanan Kami */}
      <section id="layanan" className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Layanan Kami</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 justify-center">
            <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
              <FaCreditCard className="text-4xl text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold">Pembayaran SPP</h4>
              <p className="text-gray-600 text-sm">
                Bayar SPP dengan metode online, praktis dan transparan kapan saja, di mana saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami */}
      <section id="tentang" className="bg-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Tentang Kami</h3>
          <p className="text-gray-700">
            SDS Taman Harapan adalah sekolah dasar swasta yang berkomitmen menyediakan pendidikan berkualitas
            dan sistem digital yang memudahkan orang tua dan siswa dalam mengakses layanan pendidikan.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-4 mt-auto">
        <p>&copy; 2025 SDS Taman Harapan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
