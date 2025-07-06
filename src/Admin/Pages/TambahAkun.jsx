import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const TambahAkun = () => {
  const [user, setUser] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8080/user");
      const data = await res.json();
      setUser(data);
      console.log('data', data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTambah = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Tambah Data user",
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
          <div>
            <label>Email</label>
            <input id="swal-name" class="swal2-input" placeholder="Masukkan email" />
          </div>
          <div>
            <label></label>
            <input id="swal-nis" class="swal2-input" placeholder="Masukkan NIS user" />
          </div>
          <div>
            <label>Kelas</label>
            <input id="swal-class" class="swal2-input" placeholder="Masukkan kelas" />
          </div>
          <div>
            <label>Password</label>
            <input id="swal-password" type="password" class="swal2-input" placeholder="Masukkan password" />
          </div>
          <div>
            <label>Alamat</label>
            <input id="swal-address" class="swal2-input" placeholder="Masukkan alamat" />
          </div>
          <div>
            <label>No Handphone</label>
            <input id="swal-handphone" class="swal2-input" placeholder="Masukkan nomor handphone" />
          </div>
        </div>
      `,
      width: 400, // Lebarnya dibatasi biar nggak terlalu besar
      customClass: {
        popup: "custom-swal-popup",
      },
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      focusConfirm: false,
      preConfirm: () => {
        return {
          email: document.getElementById("swal-name").value,
          password: document.getElementById("swal-nis").value,
          level: document.getElementById("swal-class").value,
          gambar: document.getElementById("swal-password").value,
        };
      },
    });
  
    if (formValues) {
      try {
        const res = await fetch("http://localhost:8080/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          Swal.fire("Berhasil", "Data user berhasil ditambahkan", "success");
          fetchData();
        } else {
          Swal.fire("Gagal", data.error || "Gagal menambahkan data", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Terjadi kesalahan saat menambahkan data", "error");
      }
    }
  };
  
  

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Akun user</h2>
      <button
        onClick={handleTambah}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tambah Data user
      </button>

      <table className="w-full border table-fixed">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 w-12">No</th>
            <th className="border p-2 w-40">Email</th>  
            <th className="border p-2 w-32">Password</th>
            <th className="border p-2 w-32">Role</th>
            <th className="border p-2 w-48">Gambar</th>
            
          </tr>
        </thead>
        <tbody>
          {user.map((item, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{item.email}</td>
              <td className="border p-2">{item.password}</td>
              <td className="border p-2">{item.level}</td>
              <td className="border p-2">{item.gambar}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TambahAkun;
