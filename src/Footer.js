import { Facebook, Instagram, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <h2 style={{ marginBottom: '20px' }}>Peternakan Puyuh Terpadu</h2>
          <p style={{ opacity: 0.8, maxWidth: '500px', margin: '0 auto 30px' }}>
            Solusi agribisnis puyuh modern, berkelanjutan, dan berstandar global untuk masa depan pangan Indonesia.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
            <SocialIcon icon={<Facebook size={20} />} href="#" />
            <SocialIcon icon={<Instagram size={20} />} href="#" />
            <SocialIcon icon={<Twitter size={20} />} href="#" />
          </div>

          <div style={{ marginBottom: '20px' }}>
             <Link to="/admin/login" style={{ color: 'var(--gray)', fontSize: '0.9rem', textDecoration: 'underline' }}>Login Admin</Link>
          </div>
        </div>
        
        <div className="footer-copy">
          <p>© 2026 Peternakan Burung Puyuh Terpadu | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon, href }) {
  return (
    <a 
      href={href} 
      style={{
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        background: 'rgba(255,255,255,0.1)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: '0.3s'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary)'}
      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
    >
      {icon}
    </a>
  )
}
