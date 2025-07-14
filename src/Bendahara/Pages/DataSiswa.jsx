import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios"
import { FaEdit, FaMoneyBill, FaTrash } from "react-icons/fa";
const MySwal = withReactContent(Swal);

const DataSiswa = () => {
  const [siswa, setSiswa] = useState([]);
  const token = localStorage.getItem("token");
  const [daftarKelas, setDaftarKelas] = useState([]);

  useEffect(() => {
  const fetchKelas = async () => {
    try {
      const res = await axios.get('https://sds-tamanharapan.cloud/api/v1/treasurer/classes', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Data kelas:", res.data.data); 
      setDaftarKelas(res.data.data || []);
    } catch (err) {
      console.error('❌ Gagal fetch kelas:', err);
    }
  };

  fetchKelas();
}, []);


  const fetchData = async () => {
    try {
      const res = await fetch ("https://sds-tamanharapan.cloud/api/v1/treasurer/students", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSiswa(data.data.data);
      console.log('respon DataSiswa', data)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();  
  }, []);

 const handleTambah = async () => {
  const kelasOptions = daftarKelas.map(kelas =>
    `<option value="${kelas.id}">${kelas.nama_kelas}</option>`
  ).join('');

  const { value: formValues } = await Swal.fire({
    title: 'Tambah Data Siswa',
    html: `
      <input id="swal-email" class="swal2-input" placeholder="Email" />
      <input id="swal-password" class="swal2-input" placeholder="Password" />
      <input id="swal-nisn" class="swal2-input" placeholder="NISN" />
      <select id="swal-kelas_id" class="swal2-input">
        <option value="">-- Pilih Kelas --</option>
        ${kelasOptions}
      </select>
      <input id="swal-nama_lengkap" class="swal2-input" placeholder="Nama Lengkap" />
      
      <select id="swal-jenis_kelamin" class="swal2-input">
        <option value="">-- Jenis Kelamin --</option>
        <option value="L">L</option>
        <option value="P">P</option>
      </select>

      <input id="swal-tempat_lahir" class="swal2-input" placeholder="Tempat Lahir" />
      <input id="swal-tanggal_lahir" class="swal2-input" type="date" />
      <input id="swal-alamat" class="swal2-input" placeholder="Alamat" />
      <input id="swal-nama_orangtua" class="swal2-input" placeholder="Nama Orang Tua" />
      <input id="swal-telepon_orangtua" class="swal2-input" placeholder="No. Handphone" />
      <input id="swal-tahun_masuk" class="swal2-input" placeholder="Tahun Masuk" type="number" />
    `,
    focusConfirm: false,
    preConfirm: () => {
      const get = (id) => document.getElementById(id).value;

      const required = [
        'swal-email',
        'swal-password',
        'swal-nisn',
        'swal-kelas_id',
        'swal-nama_lengkap',
        'swal-jenis_kelamin'
      ];
      for (let id of required) {
        if (!get(id)) {
          Swal.showValidationMessage("Field wajib diisi: " + id.replace('swal-', ''));
          return null;
        }
      }
      const tanggalInput = get('swal-tanggal_lahir');
      const tanggalFormatted = new Date(tanggalInput).toISOString().slice(0, 10);

      return {
        email: get('swal-email'),
        password: get('swal-password'),
        nisn: get('swal-nisn'),
        kelas_id: parseInt(get('swal-kelas_id')),
        nama_lengkap: get('swal-nama_lengkap'),
        jenis_kelamin: get('swal-jenis_kelamin'),
        tempat_lahir: get('swal-tempat_lahir'),
        tanggal_lahir: tanggalFormatted,
        alamat: get('swal-alamat'),
        nama_orangtua: get('swal-nama_orangtua'),
        telepon_orangtua: get('swal-telepon_orangtua'),
        tahun_masuk: parseInt(get('swal-tahun_masuk')),
      };
    }
  });

  if (formValues) {
    try {
      await axios.post('https://sds-tamanharapan.cloud/api/v1/treasurer/students', formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      Swal.fire('Sukses', 'Data siswa berhasil ditambahkan!', 'success');
      fetchData();
    } catch (error) {
      console.error('❌ Gagal menambahkan siswa:', error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan siswa.', 'error');
    }
  }
};


 const handleEdit = async (item) => {
  const { value: formValues } = await MySwal.fire({
    title: "Edit Data Siswa",
    html: `
      <input id="email" class="swal2-input" placeholder="Email" value="${item.email}" />
      <input id="kelas_id" class="swal2-input" placeholder="Kelas ID" type="number" value="${item.kelas_id}" />
      <input id="nama_lengkap" class="swal2-input" placeholder="Nama Lengkap" value="${item.nama_lengkap}" />
      <select id="jenis_kelamin" class="swal2-input">
        <option value="L" ${item.jenis_kelamin === "L" ? "selected" : ""}>L</option>
        <option value="P" ${item.jenis_kelamin === "P" ? "selected" : ""}>P</option>
      </select>
      <input id="tempat_lahir" class="swal2-input" placeholder="Tempat Lahir" value="${item.tempat_lahir}" />
      <input id="tanggal_lahir" class="swal2-input" placeholder="Tanggal Lahir (YYYY-MM-DD)" value="${item.tanggal_lahir}" />
      <input id="alamat" class="swal2-input" placeholder="Alamat" value="${item.alamat}" />
      <input id="tahun_masuk" class="swal2-input" placeholder="Tahun Masuk" type="number" value="${item.tahun_masuk}" />
    `,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const get = (id) => document.getElementById(id).value;

      return {
        email: get("email"),
        nisn: item.nisn, 
        kelas_id: parseInt(get("kelas_id")),
        nama_lengkap: get("nama_lengkap"),
        jenis_kelamin: get("jenis_kelamin"), 
        tempat_lahir: get("tempat_lahir"),
        tanggal_lahir: get("tanggal_lahir"),
        alamat: get("alamat"),
        tahun_masuk: parseInt(get("tahun_masuk")),
        status: "aktif",
        status_user: "aktif",
      };
    },
  });

  if (formValues) {
    try {
      const res = await fetch(`https://sds-tamanharapan.cloud/api/v1/treasurer/students/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Berhasil", "Data siswa berhasil diperbarui", "success");
        fetchData();
      } else {
        Swal.fire("Gagal", data.message || "Gagal mengedit data", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Terjadi kesalahan saat mengedit data", "error");
    }
  }
};


const handleDelete = async (id) => {
  const confirm = await MySwal.fire({
    title: "Hapus Data",
    text: "Apakah kamu yakin ingin menghapus data ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (confirm.isConfirmed) {
    try {
      const res = await fetch(`https://sds-tamanharapan.cloud/api/v1/treasurer/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        Swal.fire("Berhasil", "Data berhasil dihapus", "success");
        fetchData();
      } else {
        const data = await res.json();
        Swal.fire("Gagal", data.message || "Gagal menghapus data", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus data", "error");
    }
  }
};


  return (
   <div className="p-6 overflow-x-auto">
  <h2 className="text-xl font-bold mb-4 text-blue-600">Daftar Data Siswa</h2>
  <button
    onClick={handleTambah}
    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    Tambah Data Siswa
  </button>

  <table className="min-w-full border text-xs">
    <thead className="bg-gray-200">
      <tr>
        <th className="border px-2 py-1 whitespace-nowrap">No</th>
        <th className="border px-2 py-1 whitespace-nowrap">Email</th>
        <th className="border px-2 py-1 whitespace-nowrap">NISN</th>
        <th className="border px-2 py-1 whitespace-nowrap">Kelas ID</th>
        <th className="border px-2 py-1 whitespace-nowrap">Nama Lengkap</th>
        <th className="border px-2 py-1 whitespace-nowrap">Jenis Kelamin</th>
        <th className="border px-2 py-1 whitespace-nowrap">Tempat Lahir</th>
        <th className="border px-2 py-1 whitespace-nowrap">Tanggal Lahir</th>
        <th className="border px-2 py-1 whitespace-nowrap">Alamat</th>
        <th className="border px-2 py-1 whitespace-nowrap">Tahun Masuk</th>
        <th className="border px-2 py-1 whitespace-nowrap">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {siswa.length > 0 ? (
        siswa.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="border px-2 py-1 text-center">{index + 1}</td>
            <td className="border px-2 py-1">{item.email}</td>
            <td className="border px-2 py-1">{item.nisn}</td>
            <td className="border px-2 py-1">{item.kelas_id}</td>
            <td className="border px-2 py-1">{item.nama_lengkap}</td>
            <td className="border px-2 py-1">{item.jenis_kelamin}</td>
            <td className="border px-2 py-1">{item.tempat_lahir}</td>
            <td className="border px-2 py-1">
              {new Date(item.tanggal_lahir).toLocaleDateString("id-ID")}
            </td>
            <td className="border px-2 py-1">{item.alamat}</td>
            <td className="border px-2 py-1">{item.tahun_masuk}</td>
            <td className="border px-4 py-2 flex justify-center gap-3">
            <button
               onClick={() => handleEdit(item)}
               className="text-blue-600 hover:text-blue-800"
               title="Edit"
      >
              <FaEdit />
              </button>
               <button
                    onClick={() => handleDelete(item.id)}
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
          <td colSpan="11" className="text-center py-4 text-gray-500">
            Tidak ada data siswa.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


  );
};

export default DataSiswa;
