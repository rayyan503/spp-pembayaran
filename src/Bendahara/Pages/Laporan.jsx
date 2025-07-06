import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const Laporan = () => {
  const [laporan, setLaporan] = useState([]);
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchLaporan = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/treasurer/reports/overall",
        { headers }
      );
      setLaporan(res.data.data || []);
    } catch (error) {
      console.error("❌ Gagal mengambil laporan:", error);
      Swal.fire("Error", "Gagal mengambil data laporan", "error");
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleCetakPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Laporan Keuangan", 14, 15);

    const tableColumn = [
      "Tahun Ajaran",
      "Bulan",
      "Total Tagihan",
      "Nominal Tagihan",
      "Nominal Terbayar",
      "Lunas",
      "Belum Bayar",
      "Pending",
      
    ];

    const tableRows = laporan.map((item) => [
      item.tahun_ajaran,
      item.nama_bulan,
      item.total_tagihan,
      `Rp ${item.total_nominal_tagihan.toLocaleString("id-ID")}`,
      `Rp ${item.total_nominal_terbayar.toLocaleString("id-ID")}`,
      item.total_lunas,
      item.total_belum_bayar,
      item.total_pending,
      
    ]);

    autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

    doc.save("laporan_keuangan.pdf");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Laporan Keuangan Bulanan</h1>

      {laporan.length > 0 ? (
        <div className="bg-white shadow-md rounded p-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCetakPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Cetak PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded shadow">
              <thead className="bg-blue-100 text-left">
                <tr>
                  <th className="p-2">Tahun Ajaran</th>
                  <th className="p-2">Bulan</th>
                  <th className="p-2">Total Tagihan</th>
                  <th className="p-2">Nominal Tagihan</th>
                  <th className="p-2">Nominal Terbayar</th>
                  <th className="p-2">Lunas</th>
                  <th className="p-2">Belum Bayar</th>
                  <th className="p-2">Pending</th>
                 
                </tr>
              </thead>
              <tbody>
                {laporan.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{item.tahun_ajaran}</td>
                    <td className="p-2">{item.nama_bulan}</td>
                    <td className="p-2">{item.total_tagihan}</td>
                    <td className="p-2">
                      Rp {item.total_nominal_tagihan.toLocaleString("id-ID")}
                    </td>
                    <td className="p-2">
                      Rp {item.total_nominal_terbayar.toLocaleString("id-ID")}
                    </td>
                    <td className="p-2">{item.total_lunas}</td>
                    <td className="p-2">{item.total_belum_bayar}</td>
                    <td className="p-2">{item.total_pending}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Memuat laporan atau tidak ada data.</p>
      )}
    </div>
  );
};

export default Laporan;
