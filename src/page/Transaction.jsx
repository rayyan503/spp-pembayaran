import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../Component/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Transaction = () => {
  const [siswa, setSiswa] = useState({});
  const [tagihan, setTagihan] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchTagihan();
    fetchRiwayat();
    fetchProfile(); 
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/me", { headers });
      setSiswa(res.data.data || {});
    } catch (error) {
      console.error("Gagal ambil profil:", error);
    }
  };

  const fetchTagihan = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/student/bills", {
        headers,
      });
      console.log('response Tagihan:', res)
      setTagihan(res.data.data || []);
    } catch (err) {
      console.error("❌ Gagal ambil tagihan:", err);
    }
  };

  const fetchRiwayat = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/student/payment-history", {
        headers,
      });
      console.log('respon fetchriwayat:', res)
      setRiwayat(res.data.data || []);
    } catch (err) {
      console.error("❌ Gagal ambil riwayat:", err);
    }
  };

  const handleBayar = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8080/api/v1/student/bills/${id}/pay`, {}, {
        headers,
      });

      const snapToken = res.data.data.snap_token;
    console.log('respon HandleBayar :', res.data.data)
    console.log('snapToken', snapToken)
      if (snapToken) {
        // Redirect ke Midtrans Snap
        window.snap.pay(snapToken, {
          onSuccess: () => {
            Swal.fire("Sukses", "Pembayaran berhasil!", "success");
            fetchTagihan();
            fetchRiwayat();
          },
          onPending: () => {
            Swal.fire("Tertunda", "Pembayaran masih diproses.", "info");
          },
          onError: () => {
            Swal.fire("Gagal", "Terjadi kesalahan dalam pembayaran.", "error");
          },
        });
      } else {
        Swal.fire("Error", "Gagal mendapatkan token pembayaran", "error");
      }
    } catch (error) {
      console.error("❌ Gagal mulai pembayaran:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat membayar.", "error");
    }
  };

const handleCetakPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Riwayat Pembayaran Siswa Per-Bulan", 14, 20);

  doc.setFontSize(12);
  doc.text(`Nama: ${siswa.nama_lengkap || "-"}`, 14, 30);
  doc.text(`Email: ${siswa.email || "-"}`, 14, 37);

  const tableColumn = ["Tahun Ajaran", "Bulan", "Jumlah Bayar", "Status"];
  const tableRows = [];

  riwayat.forEach((item) => {
    tableRows.push([
      item.tahun_ajaran,
      item.nama_periode,
      `Rp ${item.jumlah_bayar.toLocaleString("id-ID")}`,
      item.status_pembayaran,
    ]);
  });

  // 🔥 Panggil autoTable dengan instance doc
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
  });

  doc.save("riwayat_pembayaran.pdf");
};



  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Transaksi Siswa</h1>

        {/* Info Siswa */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Data Siswa</h2>
          <p>Nama: {siswa.nama_lengkap || "-"}</p>
          <p>email: {siswa.email || "-"}</p>
        </div>

        {/* Tagihan SPP */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Tagihan SPP</h2>
          <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2">Tahun Ajaran</th>
                <th className="p-2">Bulan</th>
                <th className="p-2">Jumlah</th>
                <th className="p-2">Status</th>
                <th className="p-2">Jatuh Tempo</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tagihan.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    Tidak ada tagihan.
                  </td>
                </tr>
              ) : (
                tagihan.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{item.tahun_ajaran}</td>
                    <td className="p-2">{item.nama_periode}</td>
                    <td className="p-2">Rp {item.jumlah_tagihan.toLocaleString("id-ID")}</td>
                    <td className="p-2 ">{item.status_pembayaran}</td>
                    <td className="border px-2 py-1">
                      {new Date(item.tanggal_jatuh_tempo).toLocaleDateString("id-ID")}
                   </td>
                    <td className="p-2">
                      {item.status_pembayaran === "Belum Bayar" || item.status_pembayaran === "belum_bayar" ? (
                   <button
                      onClick={() => handleBayar(item.id)}
                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                   >
                     Bayar
                  </button>
                     ) : (
                   <span className="text-green-500 italic">Sudah Dibayar</span>
  )}
</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Riwayat Pembayaran */}
       {/* Riwayat Pembayaran */}
<div className="mt-10">
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-lg font-semibold text-gray-700">Riwayat Pembayaran</h2>
    <button
      onClick={handleCetakPDF}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
    >
      Cetak PDF
    </button>
  </div>

  <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2">Tahun Ajaran</th>
        <th className="p-2">Bulan</th>
        <th className="p-2">Jumlah Bayar</th>
        <th className="p-2">Status Pembayaran</th>
      </tr>
    </thead>
    <tbody>
      {riwayat.length === 0 ? (
        <tr>
          <td colSpan={4} className="text-center text-gray-500 py-4">
            Belum ada riwayat pembayaran.
          </td>
        </tr>
      ) : (
        riwayat.map((item) => (
          <tr key={item.id} className="border-t">
            <td className="p-2">{item.tahun_ajaran}</td>
            <td className="p-2">{item.nama_periode}</td>
            <td className="p-2">Rp {item.jumlah_bayar.toLocaleString("id-ID")}</td>
            <td className="p-2 text-green-600 font-medium capitalize">
              {item.status_pembayaran}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
};

export default Transaction;
