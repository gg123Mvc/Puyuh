import React, { createContext, useContext, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, CheckCircle, Info, Save } from 'lucide-react'

const ConfirmContext = createContext()

export function useConfirm() {
  return useContext(ConfirmContext)
}

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState({ 
    open: false, 
    title: '', 
    message: '', 
    variant: 'danger', // danger | confirm | info
    confirmLabel: 'Konfirmasi',
    onConfirm: null 
  })
  
  const confirm = (message, title = 'Konfirmasi', options = {}) => {
    const { variant = 'danger', confirmLabel = variant === 'danger' ? 'Hapus' : 'Ya, Lanjutkan' } = options

    return new Promise((resolve) => {
      setDialog({
        open: true,
        title,
        message,
        variant,
        confirmLabel,
        onConfirm: () => {
          resolve(true)
          setDialog(prev => ({ ...prev, open: false }))
        },
        onCancel: () => {
          resolve(false)
          setDialog(prev => ({ ...prev, open: false }))
        }
      })
    })
  }

  // Styles based on variant
  const getStyles = (variant) => {
    switch (variant) {
      case 'confirm':
        return {
          bg: '#e0f2fe', color: '#0284c7', btnBg: '#0284c7', icon: <CheckCircle size={32} />, btnIcon: <CheckCircle size={18} />
        }
      case 'info':
        return {
          bg: '#f3f4f6', color: '#4b5563', btnBg: '#4b5563', icon: <Info size={32} />, btnIcon: <Info size={18} />
        }
      case 'danger':
      default:
        return {
          bg: '#fee2e2', color: '#ef4444', btnBg: '#ef4444', icon: <Trash2 size={32} />, btnIcon: <Trash2 size={18} />
        }
    }
  }

  const styles = getStyles(dialog.variant)

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {dialog.open && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dialog.onCancel}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)'
              }}
            />

            {/* DIALOG BOX */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                background: 'white',
                width: '100%', maxWidth: '400px',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                position: 'relative',
                zIndex: 10001,
                textAlign: 'center'
              }}
            >
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', background: styles.bg, 
                color: styles.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                {styles.icon}
              </div>
              
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#1e293b' }}>{dialog.title}</h3>
              <p style={{ margin: '0 0 24px 0', color: '#64748b', lineHeight: 1.5 }}>
                {dialog.message}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={dialog.onCancel}
                  style={{
                    padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    background: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={dialog.onConfirm}
                  style={{
                    padding: '12px', borderRadius: '10px', border: 'none',
                    background: styles.btnBg, color: 'white', fontWeight: '600', cursor: 'pointer',
                    fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {styles.btnIcon} {dialog.confirmLabel}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  )
}
