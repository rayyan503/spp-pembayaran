import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TingkatKelas = () => {
  const [kelasList, setKelasList] = useState([]);
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://spp-payment-api-rayyan5038480-05ynou93.leapcell.dev/api/v1/admin/class-levels', {
        headers,
      });
      setKelasList(response.data.data);
    } catch (error) {
      console.error('❌ Gagal mengambil data kelas:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Tingkat Kelas</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm md:text-base table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Tingkat</th>
              <th className="border px-4 py-2">Nama Tingkat</th>
              <th className="border px-4 py-2">Biaya SPP</th>
              <th className="border px-4 py-2">Status</th>
              
            </tr>
          </thead>
          <tbody>
            {kelasList.length > 0 ? (
              kelasList.map((kelas, index) => (
                <tr key={kelas.ID} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{kelas.Tingkat}</td>
                  <td className="border px-4 py-2">{kelas.NamaTingkat}</td>
                  <td className="border px-4 py-2">Rp {kelas.BiayaSPP.toLocaleString()}</td>
                  <td className="border px-4 py-2 capitalize">{kelas.Status}</td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada data kelas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TingkatKelas;
