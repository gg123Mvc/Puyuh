import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import logo from './assets/puyuh.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Produk & Layanan', path: '/services' },
    { name: 'Profil', path: '/profile' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <motion.img 
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={logo} 
            alt="Logo Peternakan Puyuh" 
          />
          <span>PuyuhTerpadu</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="underline"
                  className="active-underline"
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--primary)',
                    borderRadius: '2px'
                  }}
                />
              )}
            </Link>
          ))}
          <a href="#contact" className="btn" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
            Hubungi Kami
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
            style={{
              position: 'absolute',
              top: '80px',
              left: 0,
              width: '100%',
              background: 'white',
              padding: '24px',
              boxShadow: 'var(--shadow-hover)',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                style={{ fontSize: '1.1rem', fontWeight: 600 }}
              >
                {link.name}
              </Link>
            ))}
            <a href="#contact" className="btn" style={{ justifyContent: 'center' }}>
              Hubungi Kami
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
