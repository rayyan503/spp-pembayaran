import { useState } from "react";
import Sidebar from "./Component/SideBar";
import Header from "./Component/Header";
import DataSiswa from "./Pages/DataSiswa";
import { Routes, Route } from "react-router-dom";
import DashboardHome from "./Pages/DashboardHome";
import Periode from "./Pages/PeriodeSPP";
import Tagihan from "./Pages/Tagihan";
import Laporan from "./Pages/Laporan";

const BendaharaLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 w-full overflow-y-auto bg-gray-100">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
       
        <main className="p-4 md:p-6">
         
         <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/datasiswa" element={<DataSiswa />} />
            <Route path="/periode" element={<Periode />} />
            <Route path="/tagihan" element={<Tagihan />} />
            <Route path="/laporan" element={<Laporan />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default BendaharaLayout;
