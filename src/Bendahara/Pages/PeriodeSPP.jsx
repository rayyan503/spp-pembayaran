import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaMoneyBill, FaTrash } from 'react-icons/fa';

const Periode = () => {
  const [periodeList, setPeriodeList] = useState([]);
  
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://sds-tamanharapan.cloud/api/v1/treasurer/periods', {
        headers,
      });
      console.log('responsePeriode', response)
      setPeriodeList(response.data.data);
      
    } catch (error) {
      console.error('❌ Gagal mengambil data periode:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

const handleTambahperiode = async () => {
  const namaBulanMap = {
    januari: 1,
    februari: 2,
    maret: 3,
    april: 4,
    mei: 5,
    juni: 6,
    juli: 7,
    agustus: 8,
    september: 9,
    oktober: 10,
    november: 11,
    desember: 12,
  };

  const { value: formValues } = await Swal.fire({
    title: 'Tambah Periode Baru',
    html: `
      <input id="swal-tahun_ajaran" class="swal2-input" placeholder="Tahun Ajaran (contoh: 2025)" />
      <input id="swal-nama_bulan" class="swal2-input" placeholder="Nama Bulan (contoh: Juli)" />
      <label style="display:block; margin-top:8px;">Tanggal Mulai</label>
      <input id="swal-tanggal_mulai" class="swal2-input" type="date" />
      <label style="display:block; margin-top:8px;">Tanggal Selesai</label>
      <input id="swal-tanggal_selesai" class="swal2-input" type="date" />
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    preConfirm: () => {
      const get = (id) => document.getElementById(id).value;

      const tahun_ajaran = get("swal-tahun_ajaran");
      const nama_bulan_input = get("swal-nama_bulan");
      const nama_bulan = nama_bulan_input.trim();
      const bulan = namaBulanMap[nama_bulan.toLowerCase()];

      const tanggal_mulai = get("swal-tanggal_mulai");
      const tanggal_selesai = get("swal-tanggal_selesai");

      if (!tahun_ajaran || !nama_bulan || !tanggal_mulai || !tanggal_selesai || !bulan) {
        Swal.showValidationMessage("Semua field wajib diisi dan nama bulan harus valid");
        return null;
      }

      const allowedTahun = "2025";
      if (tahun_ajaran !== allowedTahun) {
        Swal.showValidationMessage(`Tahun ajaran hanya boleh ${allowedTahun}`);
        return null;
      }

      return {
        tahun_ajaran,
        nama_bulan,
        bulan,
        tanggal_mulai,    
        tanggal_selesai,
      };
    },
  });

  if (formValues) {
    try {
      await axios.post('https://sds-tamanharapan.cloud/api/v1/treasurer/periods', formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("Sukses", "Periode berhasil ditambahkan!", "success");
      fetchData();
    } catch (error) {
      console.error("❌ Gagal menambahkan periode:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menambahkan periode.", "error");
    }
  }
};

 const handleEdit = async (periode) => {
  const { value: formValues } = await Swal.fire({
    title: 'Edit Periode',
    html: `
      <input id="swal-tahun" class="swal2-input" placeholder="Tahun Ajaran" value="${periode.TahunAjaran}" />
      <input id="swal-nama-bulan" class="swal2-input" placeholder="Nama Bulan" value="${periode.NamaBulan}" />
      <input id="swal-bulan" class="swal2-input" placeholder="Bulan (1-12)" type="number" min="1" max="12" value="${periode.Bulan}" />
      <label style="display:block; margin:0 0 5px 0; font-size:14px;">Tanggal Mulai</label>
      <input id="swal-mulai" class="swal2-input" type="date" value="${periode.TanggalMulai.slice(0, 10)}" />
      <label style="display:block; margin:10px 0 5px 0; font-size:14px;">Tanggal Selesai</label>
      <input id="swal-selesai" class="swal2-input" type="date" value="${periode.TanggalSelesai.slice(0, 10)}" />
    `,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Batal',
    focusConfirm: false,
    preConfirm: () => {
      const get = (id) => document.getElementById(id).value;

      const tahun_ajaran = get("swal-tahun");
      const nama_bulan = get("swal-nama-bulan");
      const bulan = parseInt(get("swal-bulan"));
      const tanggal_mulai = get("swal-mulai");
      const tanggal_selesai = get("swal-selesai");

      if (!tahun_ajaran || !nama_bulan || !bulan || !tanggal_mulai || !tanggal_selesai) {
        Swal.showValidationMessage('Semua field wajib diisi');
        return null;
      }

      return {
        tahun_ajaran,
        nama_bulan,
        bulan,
        tanggal_mulai,
        tanggal_selesai,
        status: periode.Status || "aktif",
      };
    },
  });

  if (formValues) {
    try {
      await axios.put(
        `https://sds-tamanharapan.cloud/api/v1/treasurer/periods/${periode.ID}`, 
        formValues,
        { headers }
      );
      Swal.fire('Sukses', 'Data periode berhasil diperbarui!', 'success');
      fetchData();
    } catch (error) {
      console.error('❌ Gagal update periode:', error.response?.data || error.message);
      Swal.fire('Gagal', 'Terjadi kesalahan saat update.', 'error');
    }
  }
};

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus periode ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://sds-tamanharapan.cloud/api/v1/treasurer/periods/${id}`, {
          headers,
        });
        Swal.fire('Sukses', 'Data periode berhasil dihapus!', 'success');
        fetchData();
      } catch (error) {
        console.error('❌ Gagal menghapus periode:', error);
        Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data.', 'error');
      }
    }
  };

  const handleGenerateBills = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire('Gagal', 'Token tidak ditemukan. Silakan login ulang.', 'error');
    return;
  }

  try {
    const response = await axios.post(
      `https://sds-tamanharapan.cloud/api/v1/treasurer/periods/${id}/generate-bills`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('responseGenerateBills:', response);
    Swal.fire('Sukses', 'Tagihan berhasil dibuat!', 'success');
  } catch (error) {
    console.error('❌ Gagal membuat tagihan:', error);
    Swal.fire('Gagal', 'Terjadi kesalahan saat membuat tagihan.', 'error');
  }
};


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Data Periode</h1>
      <div className="flex justify-end mb-4">
    <button
    onClick={handleTambahperiode}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
  >
    + Tambah Periode
  </button>
</div>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm md:text-base table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Tahun Ajaran</th>
              <th className="border px-4 py-2">Nama Bulan</th>
              <th className="border px-4 py-2">Tanggal Mulai</th>
              <th className="border px-4 py-2">Tanggal Selesai</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {periodeList.length > 0 ? (
              periodeList.map((periode, index) => (
                <tr key={periode.id} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>  
                   <td className="border px-4 py-2">{periode.TahunAjaran}</td>                
                  <td className="border px-4 py-2">{periode.NamaBulan}</td>
                  <td className="border px-2 py-1">
              {new Date(periode.TanggalMulai).toLocaleDateString("id-ID")}
            </td>
                  <td className="border px-2 py-1">
              {new Date(periode.TanggalSelesai).toLocaleDateString("id-ID")}
            </td>
                  <td className="border px-4 py-2 capitalize">{periode.Status}</td>
                  <td className="border px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(periode)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(periode.ID)}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleGenerateBills(periode.ID)}
                      className="text-green-600 hover:text-green-800"
                      title="Detail"
                      >
                      <FaMoneyBill />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada data periode.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Periode;
