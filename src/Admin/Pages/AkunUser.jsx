import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

const AkunUser = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://sds-tamanharapan.cloud/api/v1/admin/users', {
        headers,
      });
      setUsers(response.data.data.data); 
    } catch (error) {
      console.error('❌ Gagal mengambil data pengguna:', error);
      Swal.fire('Gagal', 'Tidak dapat memuat data pengguna.', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTambahUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Pengguna Baru',
      html: `
        <input id="swal-nama" class="swal2-input" placeholder="Nama Lengkap">
        <input id="swal-email" class="swal2-input" placeholder="Email">
        <input id="swal-password" type="password" class="swal2-input" placeholder="Password">
        <input id="swal-role-id" class="swal2-input" type="number" placeholder="Role ID (contoh: 2)">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nama = document.getElementById('swal-nama').value;
        const email = document.getElementById('swal-email').value;
        const password = document.getElementById('swal-password').value;
        const role_id = document.getElementById('swal-role-id').value;

        if (!nama || !email || !password || !role_id) {
          Swal.showValidationMessage('Semua field wajib diisi');
          return;
        }

        return {
          nama_lengkap: nama,
          email,
          password,
          role_id: parseInt(role_id),
        };
      },
    });

    if (formValues) {
      try {
        await axios.post('https://sds-tamanharapan.cloud/api/v1/admin/users', formValues, { headers });
        Swal.fire('Sukses', 'Pengguna berhasil ditambahkan!', 'success');
        fetchUsers();
      } catch (error) {
        console.error('❌ Gagal menambahkan pengguna:', error);
        Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan.', 'error');
      }
    }
  };

const handleEditUser = async (user) => {
  const { value: formValues } = await Swal.fire({
    title: 'Edit Pengguna',
    html: `
      <input id="swal-nama" class="swal2-input" value="${user.nama_lengkap}" placeholder="Nama Lengkap">
      <input id="swal-email" class="swal2-input" value="${user.email}" placeholder="Email">
      
    `,
    focusConfirm: false,
    preConfirm: () => {
      const nama = document.getElementById('swal-nama').value;
      const email = document.getElementById('swal-email').value;

      if (!nama || !email ) {
        Swal.showValidationMessage('Semua field wajib diisi');
        return;
      }

      return {
        nama_lengkap: nama,
        email,
        role_id: user.role_id || 2
      };
    },
  });

  if (formValues) {
    try {
      await axios.put(`https://sds-tamanharapan.cloud/api/v1/admin/users/${user.id}`, formValues, { headers });
      Swal.fire('Sukses', 'Data pengguna berhasil diperbarui.', 'success');
      
      fetchUsers(); 
    } catch (error) {
      console.error('❌ Gagal update pengguna:', error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat update.', 'error');
    }
  }
};


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus pengguna ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://sds-tamanharapan.cloud/api/v1/admin/users/${id}`, {
          headers,
        });
        Swal.fire('Sukses', 'Pengguna berhasil dihapus.', 'success');
        fetchUsers();
      } catch (error) {
        console.error('❌ Gagal menghapus pengguna:', error);
        Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus.', 'error');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Daftar Data Akun </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleTambahUser}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FaPlus /> Tambah Akun Admin atau Bendahara
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Nama Lengkap</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{user.nama_lengkap}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2 capitalize">{user.role}</td>
                  <td className="border px-4 py-2 flex justify-center gap-3">
                     <button
                         onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        >
                     <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Tidak ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AkunUser;
