import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { Bird, Archive, Activity, DollarSign, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts'

export default function Dashboard() {
  console.log("Dashboard Mounting...")
  const [stats, setStats] = useState({
    totalPuyuh: 0,
    activeCages: 0,
    totalExpenses: 0,
    pakanStock: 0
  })
  
  const [recentLogs, setRecentLogs] = useState([])
  
  // Data Simulasi untuk Grafik
  // Data Simulasi removed in favor of Real Data


  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // 1. Fetch Summary Data
    const { data: cages } = await supabase.from('kandang').select('jumlah_puyuh')
    const { data: pembelian } = await supabase.from('pembelian').select('*').order('created_at', { ascending: true })
    
    // Fetch Activity Logs
    const { data: logs } = await supabase
      .from('riwayat_populasi')
      .select('*, kandang:kandang_id(nama_kandang)')
      .order('created_at', { ascending: false })
      .limit(5)

    if (logs) setRecentLogs(logs)

    if (cages && pembelian) {
      // Total Populasi
      const totalP = cages.reduce((acc, curr) => acc + curr.jumlah_puyuh, 0)
      
      // Total Pengeluaran (All Time)
      const totalE = pembelian.reduce((acc, curr) => acc + (curr.harga_total || 0), 0)

      // --- PROCESS CHARTS DATA (12 Months + Smart Estimation) ---
      
      const currentYear = new Date().getFullYear();
      const currentMonthIdx = new Date().getMonth(); // 0 = Jan, 1 = Feb...

      // 1. Initialize 12 Months for Current Year
      const yearMonths = Array.from({length: 12}, (_, i) => {
        const d = new Date(currentYear, i, 1);
        return { 
          name: d.toLocaleString('default', { month: 'short' }), 
          monthIdx: i,
          year: currentYear,
          isFuture: i > currentMonthIdx,
          pengeluaran: 0, 
          pakan: 0 
        };
      });

      // 2. Aggregate Real Data
      pembelian.forEach(item => {
        const date = new Date(item.created_at || item.tanggal);
        // Only count data for current year
        if (date.getFullYear() === currentYear) {
           const monthIdx = date.getMonth();
           if (yearMonths[monthIdx]) {
             yearMonths[monthIdx].pengeluaran += (item.harga_total || 0);
             if (item.kategori === 'pakan') {
               yearMonths[monthIdx].pakan += (item.harga_total || 0);
             }
           }
        }
      });

      // 3. Smart Estimation Logic
      // Calculate average of *past* months that have data (or at least passed months)
      // We assume past months with 0 are actual 0s, but for better estimation usually we ignore empty start months.
      // Simple Average: Sum of Expenses / (Current Month Index + 1)
      let sumPengeluaran = 0;
      let sumPakan = 0;
      let count = 0;

      for (let i = 0; i <= currentMonthIdx; i++) {
        sumPengeluaran += yearMonths[i].pengeluaran;
        sumPakan += yearMonths[i].pakan;
        count++;
      }

      const avgPengeluaran = count > 0 ? (sumPengeluaran / count) : 0;
      const avgPakan = count > 0 ? (sumPakan / count) : 0;

      // Apply Estimation to Future Months
      yearMonths.forEach(m => {
        if (m.isFuture) {
          m.pengeluaran = avgPengeluaran;
          m.pakan = avgPakan;
          m.isEstimated = true;
        }
      });

      // 4. Prepare Final Chart Data
      const processedDataUang = yearMonths.map(m => ({
        name: m.name,
        // Estimation: Pendapatan predicted at 1.5x expenses (Profit margin assumption)
        pendapatan: m.pengeluaran * 1.5, 
        pengeluaran: m.pengeluaran,
        profit: (m.pengeluaran * 1.5) - m.pengeluaran,
        isEstimated: m.isEstimated
      }));

      const processedDataPakan = yearMonths.map(m => ({
        name: m.name,
        pengeluaran: m.pakan,
        isEstimated: m.isEstimated
      }));
      
      // Update State
      setStats({
        totalPuyuh: totalP,
        activeCages: cages.length,
        totalExpenses: totalE,
        pakanStock: 15 
      })
      
      setDataPakanState(processedDataPakan);
      setDataUangState(processedDataUang);
    }
  }

  // State for Charts
  const [dataPakanState, setDataPakanState] = useState([])
  const [dataUangState, setDataUangState] = useState([])

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '10px' }}>Dashboard Overview</h1>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>Ringkasan performa peternakan puyuh Anda hari ini.</p>
      
      {/* STAT CARDS */}
      <div className="grid-3" style={{ gap: '20px' }}>
        <StatCard 
          title="Total Populasi" 
          value={`${stats.totalPuyuh} Ekor`} 
          icon={<Bird size={28} />} 
          color="#2563eb"
          bg="#eff6ff"
        />
        <StatCard 
          title="Total Pengeluaran" 
          value={`Rp ${(stats.totalExpenses / 1000000).toFixed(1)} Jt`} 
          icon={<DollarSign size={28} />} 
          color="#ef4444"
          bg="#fef2f2"
        />
        <StatCard 
          title="Estimasi Profit" 
          value="+12%" 
          icon={<TrendingUp size={28} />} 
          color="#10b981"
          bg="#f0fdf4"
          sub="Banding bulan lalu"
        />
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '30px' }}>
        
        {/* GRAPH 1: UANG (Simulasi Keuangan) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b' }}>Simulasi Arus Kas (6 Bulan)</h3>
            <span style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px', background: '#f1f5f9', color: '#64748b' }}>Estimasi</span>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataUangState}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${value/1000000}jt`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => `Rp ${value.toLocaleString()}`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Area type="monotone" dataKey="pendapatan" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                <Area type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={2} fillOpacity={0} fill="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* GRAPH 2: PAKAN (Simulasi Pengeluaran Pakan) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b' }}>Pengeluaran Pakan</h3>
             <span style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px', background: '#fef3c7', color: '#d97706' }}>Real Data</span>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataPakanState}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${value/1000000}jt`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => `Rp ${value.toLocaleString()}`}
                />
                <Bar dataKey="pengeluaran" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} name="Biaya Pakan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '30px' }}>

        {/* ACTIVITY LOG WIDGET */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ gridColumn: '1 / -1', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b' }}>Aktivitas Kandang Terkini</h3>
            <Activity size={20} color="#64748b" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLogs.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum ada aktivitas tercatat.</p>
            ) : recentLogs.map(log => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', 
                    background: log.jenis_perubahan === 'pengurangan' ? '#fef2f2' : '#f0fdf4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: log.jenis_perubahan === 'pengurangan' ? '#ef4444' : '#16a34a'
                  }}>
                    <Archive size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>
                      {log.kandang?.nama_kandang || 'Kandang'} 
                      <span style={{ fontWeight: '400', color: '#64748b' }}> - {log.alasan}</span>
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                      Oleh: {log.user_input} • {new Date(log.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span style={{ 
                  fontWeight: '700', 
                  color: log.jenis_perubahan === 'pengurangan' ? '#ef4444' : '#16a34a' 
                }}>
                  {log.jenis_perubahan === 'pengurangan' ? '-' : '+'}{log.jumlah}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, bg, sub }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        border: '1px solid #f1f5f9'
      }}
    >
      <div style={{ 
        padding: '12px', 
        borderRadius: '12px', 
        background: bg, 
        color: color 
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>{title}</p>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' }}>{value}</h3>
        {sub && <p style={{ fontSize: '0.8rem', color: color, marginTop: '4px' }}>{sub}</p>}
      </div>
    </motion.div>
  )
}

