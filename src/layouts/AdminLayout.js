import { Link, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { LayoutDashboard, Users, ShoppingCart, Package, LogOut } from 'lucide-react'
import logo from '../assets/puyuh.png'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'Manajemen Kandang', path: '/admin/kandang' },
    { icon: <ShoppingCart size={20} />, label: 'Pembelian', path: '/admin/pembelian' },
    { icon: <Package size={20} />, label: 'Pemberian Pakan', path: '/admin/pakan' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: '260px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <img src={logo} alt="Logo" style={{ width: '40px' }} />
          <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#0f172a' }}>Puyuh Admin</span>
        </div>

        <nav style={{ padding: '24px', flex: 1 }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: '#475569',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9' }}>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: '#fef2f2',
              color: '#ef4444',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
