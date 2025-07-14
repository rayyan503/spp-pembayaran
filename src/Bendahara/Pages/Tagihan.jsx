import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Tagihan = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchBills = async () => {
    try {
      const response = await axios.get('https://sds-tamanharapan.cloud/api/v1/treasurer/bills', {
        headers,
      });
      console.log('responseTagihan : ', response)
      setBills(response.data.data.data || []);
    } catch (error) {
      console.error('❌ Gagal mengambil data tagihan:', error);
      Swal.fire('Error', 'Gagal mengambil data tagihan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Daftar Tagihan</h1>

      {loading ? (
        <p className="text-gray-500">Memuat data tagihan...</p>
      ) : bills.length === 0 ? (
        <p className="text-gray-500">Tidak ada data tagihan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm md:text-base table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Jumlah Tagihan</th>
                <th className="border px-4 py-2">Nama Periode</th>
                <th className="border px-4 py-2">Nama Siswa</th>
                <th className='border px-4 py-2'>Tahun Ajaran</th>
                <th className="border px-4 py-2">Status Pembayaran</th>
                <th className="border px-4 py-2">Tanggal Jatuh Tempo</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={bill.ID} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">Rp{bill.jumlah_tagihan?.toLocaleString('id-ID')}</td>
                  <td className="border px-4 py-2">{bill.nama_periode}</td>
                  <td className="border px-4 py-2">{bill.nama_siswa}</td>
                  <td className="border px-4 py-2">{bill.tahun_ajaran}</td>
                  <td className="border px-4 py-2 ">{bill.status_pembayaran }</td>
                   <td className="border px-2 py-1">
                      {new Date(bill.tanggal_jatuh_tempo).toLocaleDateString("id-ID")}
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tagihan;
