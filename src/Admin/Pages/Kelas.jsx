import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Kelas = () => {
  const [kelasList, setKelasList] = useState([]);
  const [daftarTingkat, setDaftarTingkat] = useState([]);
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

useEffect(() => {
  const fetchTingkat = async () => {
    try {
      const res = await axios.get('https://sds-tamanharapan.cloud/api/v1/admin/class-levels', {
        headers,
      });
      setDaftarTingkat(res.data.data || []);
    } catch (err) {
      console.error('❌ Gagal fetch tingkat:', err);
    }
  };

  fetchTingkat();
}, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://sds-tamanharapan.cloud/api/v1/treasurer/classes', {
        headers,
      });
      console.log('responseKelas', response)
      setKelasList(response.data.data);
      
    } catch (error) {
      console.error('❌ Gagal mengambil data kelasSiswa:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

const handleTambahKelas = async () => {
  
  const tingkatOptions = daftarTingkat
    .map((item) => `<option value="${item.ID}">${item.NamaTingkat}</option>`)
    .join('');

  const { value: formValues } = await Swal.fire({
    title: 'Tambah Kelas Baru',
    html: `
      <select id="swal-tingkat" class="swal2-input">
        <option value="">-- Pilih Tingkat --</option>
        ${tingkatOptions}
      </select>
      <input id="swal-nama" class="swal2-input" placeholder="Nama Kelas (contoh: 1A)" />
      <input id="swal-wali" class="swal2-input" placeholder="Wali Kelas" />
      <input id="swal-kapasitas" class="swal2-input" placeholder="Kapasitas" type="number" />
    `,
    focusConfirm: false,
    preConfirm: () => {
      const tingkat_id = parseInt(document.getElementById('swal-tingkat').value);
      const nama_kelas = document.getElementById('swal-nama').value;
      const wali_kelas = document.getElementById('swal-wali').value;
      const kapasitas = parseInt(document.getElementById('swal-kapasitas').value);

      if (!tingkat_id || !nama_kelas || !wali_kelas || !kapasitas) {
        Swal.showValidationMessage('Semua field wajib diisi');
        return null;
      }

      return {
        tingkat_id,
        nama_kelas,
        wali_kelas,
        kapasitas,
      };
    },
  });

  if (formValues) {
    try {
      await axios.post('https://sds-tamanharapan.cloud/api/v1/admin/classes', formValues, {
        headers,
      });
      Swal.fire('Sukses', 'Kelas berhasil ditambahkan!', 'success');
      fetchData();
    } catch (error) {
      console.error('❌ Gagal menambahkan kelas:', error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan kelas.', 'error');
    }
  }
};


  const handleEdit = async (kelas) => {
  const { value: formValues } = await Swal.fire({
    title: 'Edit Kelas',
    html: `
      
      <input id="swal-nama" class="swal2-input" placeholder="Nama Kelas" value="${kelas.nama_kelas}" />
      <input id="swal-wali" class="swal2-input" placeholder="Wali Kelas" value="${kelas.wali_kelas}" />
      <input id="swal-kapasitas" class="swal2-input" placeholder="Kapasitas" type="number" value="${kelas.kapasitas}" />
    `,
    focusConfirm: false,
    preConfirm: () => {
      
      const nama_kelas = document.getElementById('swal-nama').value;
      const wali_kelas = document.getElementById('swal-wali').value;
      const kapasitas = parseInt(document.getElementById('swal-kapasitas').value);

      if ( !nama_kelas || !wali_kelas || !kapasitas) {
        Swal.showValidationMessage('Semua field wajib diisi');
        return null;
      }

      return {
       tingkat_id: kelas.tingkat_id,
        nama_kelas,
        wali_kelas,
        kapasitas,
        status: kelas.status || 'aktif',
      };
    },
  });

  if (formValues) {
    try {
      await axios.put(`https://sds-tamanharapan.cloud/api/v1/admin/classes/${kelas.id}`, formValues, {
        headers,
      });
      Swal.fire('Sukses', 'Data kelas berhasil diperbarui!', 'success');
      fetchData();
    } catch (error) {
      console.error('❌ Gagal update kelas:', error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat update.', 'error');
    }
  }
};


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus kelas ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://sds-tamanharapan.cloud/api/v1/admin/classes/${id}`, {
          headers,
        });
        Swal.fire('Sukses', 'Data kelas berhasil dihapus!', 'success');
        fetchData();
      } catch (error) {
        console.error('❌ Gagal menghapus kelas:', error);
        Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data.', 'error');
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Data Kelas</h1>
      <div className="flex justify-end mb-4">
    <button
    onClick={handleTambahKelas}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
  >
    + Tambah Kelas
  </button>
</div>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm md:text-base table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">No</th>
              
              <th className="border px-4 py-2">Nama Kelas</th>
              <th className="border px-4 py-2">Wali Kelas</th>
              <th className="border px-4 py-2">Kapasitas</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kelasList.length > 0 ? (
              kelasList.map((kelas, index) => (
                <tr key={kelas.id} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  
                  <td className="border px-4 py-2">{kelas.nama_kelas}</td>
                  <td className="border px-4 py-2">{kelas.wali_kelas}</td>
                  <td className="border px-4 py-2 capitalize">{kelas.kapasitas}</td>
                  <td className="border px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(kelas)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(kelas.ID)}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus"
                    >
                      <FaTrash />
                    </button>
                  </td>
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

export default Kelas;
