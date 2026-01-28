import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./Layout"
import Profile from "./Profile"
import Services from "./Services"
import Home from "./Home"

// ADMIN
import ProtectRoute from "./auth/ProtectRoute"
import Login from "./pages/admin/Login"
import Register from "./pages/admin/Register"
import AdminLayout from "./layouts/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import KandangManager from "./pages/admin/KandangManager"
import PembelianManager from "./pages/admin/PembelianManager"
import PakanManager from "./pages/admin/PakanManager"
import TelurManager from "./pages/admin/TelurManager"
import InkubatorManager from "./pages/admin/InkubatorManager"

export default function App() {
  return (
    <Routes>

      {/* REACT APP IS NOW ONLY FOR ADMIN */}
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* AUTH */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<Register />} />

      {/* ADMIN (PROTECTED) */}
      <Route path="/admin" element={<ProtectRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kandang" element={<KandangManager />} />
          <Route path="pembelian" element={<PembelianManager />} />
          <Route path="pakan" element={<PakanManager />} />
          <Route path="telur" element={<TelurManager />} />
          <Route path="inkubator" element={<InkubatorManager />} />
        </Route>
      </Route>

      {/* NOT FOUND - Redirect to Admin Login */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />

    </Routes>
  )
}
