import { Routes, Route } from "react-router-dom"
import Layout from "./Layout"
import Home from "./Home"
import Profile from "./Profile"
import Services from "./Services"

// ADMIN IMPORTS
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
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="services" element={<Services />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<Register />} />
      
      <Route path="/admin" element={<ProtectRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kandang" element={<KandangManager />} />
          <Route path="pembelian" element={<PembelianManager />} />
          <Route path="pakan" element={<PakanManager />} />
        </Route>
      </Route>
    </Routes>
  )
}
