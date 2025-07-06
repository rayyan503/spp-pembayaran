import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./auth/LoginPage";

import HomePage from "./page/Home";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Transaction from "./page/Transaction";
import AdminLayout from "./Admin/AdminLayout";
import BendaharaLayout from "./Bendahara/BendaharaLayout";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pembayaran" element={<Transaction />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/bendahara/*" element={<BendaharaLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
