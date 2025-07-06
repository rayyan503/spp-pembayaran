import { useState } from "react";
import Sidebar from "./Component/SideBar";
import Header from "./Component/Header";
import DashboardHome from "./Pages/DashboardHome";
import { Routes, Route } from "react-router-dom";
import AkunUser from "./Pages/AkunUser";
import Kelas from "./Pages/Kelas";
import TingkatKelas from "./Pages/TingkatKelas";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 w-full overflow-y-auto bg-gray-100">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 md:p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/akunuser" element={<AkunUser />} />
            <Route path="/kelas" element={<Kelas/>} />
            <Route path="/tingkatkelas" element={<TingkatKelas/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
