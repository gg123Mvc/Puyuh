import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./Layout"
import Profile from "./Profile"
import Services from "./Services"

// ADMIN
import ProtectRoute from "./auth/ProtectRoute"
import Login from "./pages/admin/Login"
import Register from "./pages/admin/Register"
import AdminLayout from "./layouts/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import KandangManager from "./pages/admin/KandangManager"
import PembelianManager from "./pages/admin/PembelianManager"
import PakanManager from "./pages/admin/PakanManager"

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="services" element={<Services />} />
      </Route>

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
        </Route>
      </Route>

      {/* NOT FOUND */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}
