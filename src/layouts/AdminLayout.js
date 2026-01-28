import { Link, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { LayoutDashboard, Users, ShoppingCart, Package, LogOut, Menu, X, Circle, ThermometerSun } from 'lucide-react'
import { useToast } from '../components/Toast'
import logo from '../assets/puyuh.png'
import { useEffect, useState } from 'react'

export default function AdminLayout() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  
  // Responsive State
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Only auto-close if resizing TO mobile. Don't auto-open on desktop if user closed it.
      if (mobile) setIsSidebarOpen(false) 
      else if (!mobile && window.innerWidth > 1024) setIsSidebarOpen(true) // Optional: Reset to open on large screen init
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Init
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    showToast('Berhasil Keluar. Sampai Jumpa!', 'success')
    navigate('/admin/login')
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'Manajemen Kandang', path: '/admin/kandang' },
    { icon: <Circle size={20} />, label: 'Produksi Telur', path: '/admin/telur' },
    { icon: <ThermometerSun size={20} />, label: 'Inkubator', path: '/admin/inkubator' },
    { icon: <ShoppingCart size={20} />, label: 'Pembelian', path: '/admin/pembelian' },
    { icon: <Package size={20} />, label: 'Pemberian Pakan', path: '/admin/pakan' },
  ]

  // Get display name or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0ea5e9&color=fff&size=128&bold=true`

  // Auto-Logout on Inactivity
  useEffect(() => {
    let timeoutId;
    const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 Minutes

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleAutoLogout, INACTIVITY_LIMIT);
    };

    const handleAutoLogout = async () => {
      await supabase.auth.signOut();
      showToast('Sesi habis (5 menit inaktif). Silakan login kembali.', 'info');
      navigate('/admin/login');
    };

    // Events to track activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    // Attach listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Init timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [navigate]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      
      {/* MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40,
            backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s'
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside style={{
        width: '280px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
        zIndex: 50,
        transition: 'transform 0.3s ease',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        left: 0, top: 0
      }}>
        {/* LOGO AREA */}
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '48px', height: '48px', 
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
              borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(37,99,235,0.2)'
            }}>
              <img src={logo} alt="Logo" style={{ width: '28px', filter: 'brightness(0) invert(1)' }} />
            </div>
            <div>
              <h1 style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a', lineHeight: 1 }}>Puyuh<span style={{color:'#2563eb'}}>Admin</span></h1>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500', marginTop: '4px' }}>Management System</p>
            </div>
          </div>
          
          {/* Close/Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b'
            }}
          >
            {isMobile ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav style={{ padding: '0 16px', flex: 1, marginTop: '10px', overflowY: 'auto' }}>
          <p style={{ padding: '0 12px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', letterSpacing: '0.05em' }}>MENU UTAMA</p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className="nav-item"
                  onClick={() => isMobile && setIsSidebarOpen(false)} // Close on click (mobile)
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: '12px',
                    color: '#64748b',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    border: '1px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f0f9ff'
                    e.currentTarget.style.color = '#0284c7'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#64748b'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* USER PROFILE & LOGOUT */}
        <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', background: '#fcfcfc' }}>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '16px',
            background: 'white',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                style={{ 
                  width: '42px', height: '42px', 
                  borderRadius: '50%', 
                  border: '2px solid white', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                }} 
              />
              <div style={{ 
                position: 'absolute', bottom: 0, right: 0, 
                width: '12px', height: '12px', 
                background: '#10b981', 
                borderRadius: '50%', 
                border: '2px solid white' 
              }}></div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {displayName}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Administrator</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px',
              border: '1px solid #fecaca',
              background: '#fef2f2',
              color: '#ef4444',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
            onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main" style={{ 
        marginLeft: isMobile ? 0 : (isSidebarOpen ? '280px' : 0), 
        flex: 1, 
        padding: '40px', // Fallback
        maxWidth: '100vw',
        overflowX: 'hidden', 
        overflowY: 'auto',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Toggle Button (Mobile OR Desktop when closed) */}
        {(!isSidebarOpen || isMobile) && (
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                padding: '10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                cursor: 'pointer'
              }}
              title="Buka Menu"
            >
              <Menu size={24} color="#334155" />
            </button>
            {/* Show page title on mobile or when sidebar is hidden */}
            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.2rem' }}>Dashboard</span>
          </div>
        )}

        <Outlet context={{ user }} />
      </main>
    </div>
  )
}
