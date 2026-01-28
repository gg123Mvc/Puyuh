import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { Bird, Archive, Activity } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPuyuh: 0,
    stokPakan: 0, // Placeholder
    activeCages: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // Fetch total puyuh from all cages
    const { data: cages } = await supabase
      .from('kandang')
      .select('jumlah_puyuh')
    
    if (cages) {
      const total = cages.reduce((acc, curr) => acc + curr.jumlah_puyuh, 0)
      setStats(prev => ({ ...prev, totalPuyuh: total, activeCages: cages.length }))
    }
  }

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '2rem' }}>Dashboard Overview</h1>
      
      <div className="grid-3" style={{ marginTop: '30px' }}>
        <StatCard 
          title="Total Puyuh" 
          value={stats.totalPuyuh} 
          icon={<Bird size={32} />} 
          color="#2563eb"
        />
        <StatCard 
          title="Kandang Aktif" 
          value={stats.activeCages} 
          icon={<Archive size={32} />} 
          color="#10b981"
        />
        <StatCard 
          title="Aktivitas Harian" 
          value="Normal" 
          icon={<Activity size={32} />} 
          color="#f59e0b"
          sub="Tidak ada peringatan"
        />
      </div>

      <div style={{ marginTop: '40px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Tren Produksi Telur (Simulasi)</h2>
        <div style={{ height: '300px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          Chart akan ditampilkan di sini setelah data tersedia
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, sub }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}
    >
      <div style={{ 
        padding: '16px', 
        borderRadius: '12px', 
        background: `${color}15`, 
        color: color 
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{title}</p>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a' }}>{value}</h3>
        {sub && <p style={{ fontSize: '0.8rem', color: color }}>{sub}</p>}
      </div>
    </motion.div>
  )
}

