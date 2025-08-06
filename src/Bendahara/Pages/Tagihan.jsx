import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Tagihan = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchBills = async () => {
    try {
      const response = await axios.get('https://sds-tamanharapan.cloud/api/v1/treasurer/bills', {
        headers,
      });
      const data = response.data.data.data || [];
      setBills(data);
      setFilteredBills(data); // initial load
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

  useEffect(() => {
    filterBills();
  }, [searchQuery, statusFilter, bills]);

  const filterBills = () => {
    const query = searchQuery.toLowerCase();

    const filtered = bills.filter((bill) => {
      const matchesQuery = bill.nama_siswa?.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === '' || bill.status_pembayaran === statusFilter;

      return matchesQuery && matchesStatus;
    });

    setFilteredBills(filtered);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Daftar Tagihan</h1>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari nama siswa..."
          className="border px-4 py-2 rounded w-full md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded w-full md:w-1/2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="belum_bayar">Belum Bayar</option>
          <option value="pending">Pending</option>
          <option value="lunas">Lunas</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data tagihan...</p>
      ) : filteredBills.length === 0 ? (
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
                <th className="border px-4 py-2">Tahun Ajaran</th>
                <th className="border px-4 py-2">Status Pembayaran</th>
                <th className="border px-4 py-2">Tanggal Jatuh Tempo</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill, index) => (
                <tr key={bill.ID} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    Rp{bill.jumlah_tagihan?.toLocaleString('id-ID')}
                  </td>
                  <td className="border px-4 py-2">{bill.nama_periode}</td>
                  <td className="border px-4 py-2">{bill.nama_siswa}</td>
                  <td className="border px-4 py-2">{bill.tahun_ajaran}</td>
                  <td className="border px-4 py-2 capitalize">{bill.status_pembayaran}</td>
                  <td className="border px-2 py-1">
                    {new Date(bill.tanggal_jatuh_tempo).toLocaleDateString('id-ID')}
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
