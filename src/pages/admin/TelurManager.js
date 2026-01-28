import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Circle, Plus, Trash2, TrendingUp } from 'lucide-react'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ConfirmDialog'

export default function TelurManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ jumah_telur: '', telur_rusak: '0', tanggal: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    const { data } = await supabase.from('produksi_telur').select('*').order('tanggal', { ascending: false })
    if (data) setLogs(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const total = parseInt(formData.jumah_telur)
    const rusak = parseInt(formData.telur_rusak)
    
    if (total < 0 || rusak < 0) return alert('Jumlah tidak boleh minus')

    const isConfirmed = await confirm(
      `Simpan data panen: ${total} butir (${rusak} rusak)?`, 
      'Konfirmasi Panen', 
      { variant: 'confirm', confirmLabel: 'Simpan' }
    )
    if (!isConfirmed) return

    const { error } = await supabase.from('produksi_telur').insert([{
      tanggal: formData.tanggal,
      jumlah_total: total,
      jumlah_rusak: rusak,
      jumlah_bagus: total - rusak
    }])

    if (!error) {
      setFormData({ ...formData, jumah_telur: '', telur_rusak: '0' })
      fetchLogs()
      showToast('Data Panen Telur Tersimpan!', 'success')
    } else {
      showToast('Gagal simpan: ' + error.message, 'error')
    }
  }

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Hapus data panen telur ini?')
    if (isConfirmed) {
      await supabase.from('produksi_telur').delete().eq('id', id)
      fetchLogs()
      showToast('Data panen dihapus', 'info')
    }
  }

  // Stats
  const totalTelur = logs.reduce((acc, curr) => acc + (curr.jumlah_total || 0), 0)
  const totalRusak = logs.reduce((acc, curr) => acc + (curr.jumlah_rusak || 0), 0)
  const estimasiPendapatan = (totalTelur - totalRusak) * 300 // Asumsi Rp 300 per butir

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Circle color="#eab308" fill="#eab308" /> Manajemen Telur
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* INPUT FORM */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '16px' }}>Input Panen Hari Ini</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Tanggal</label>
              <input 
                type="date" required
                value={formData.tanggal}
                onChange={e => setFormData({...formData, tanggal: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Total Butir Telur</label>
              <input 
                type="number" required placeholder="0"
                value={formData.jumah_telur}
                onChange={e => setFormData({...formData, jumah_telur: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Telur Pecah / Rusak</label>
              <input 
                type="number" required placeholder="0"
                value={formData.telur_rusak}
                onChange={e => setFormData({...formData, telur_rusak: e.target.value})}
                style={inputStyle}
              />
            </div>
            
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <p style={{ fontSize: '0.9rem', color: '#166534', display: 'flex', justifyContent: 'space-between' }}>
                <span>Telur Bagus:</span>
                <strong>{(parseInt(formData.jumah_telur || 0) - parseInt(formData.telur_rusak || 0))} btr</strong>
              </p>
            </div>

            <button type="submit" className="btn" style={{ justifyContent: 'center', background: '#eab308', color: 'black' }}>
              <Plus size={18} /> Simpan Data
            </button>
          </form>
        </div>

        {/* STATS & LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* STAT CARD */}
          <div style={{ background: 'linear-gradient(135deg, #fef9c3, #fef08a)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(234,179,8,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <TrendingUp size={20} color="#854d0e" />
              <h4 style={{ margin: 0, color: '#854d0e' }}>Estimasi Pendapatan Telur</h4>
            </div>
            <h2 style={{ fontSize: '2rem', margin: 0, color: '#713f12' }}>Rp {estimasiPendapatan.toLocaleString()}</h2>
            <p style={{ margin: '4px 0 0', color: '#854d0e', fontSize: '0.9rem' }}>Total {totalTelur.toLocaleString()} butir terkumpul</p>
          </div>

          {/* LINK TO INCUBATOR */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #fdba74', background: '#fff7ed' }}>
            <div>
               <h4 style={{ margin: 0, color: '#9a3412' }}>Punya Telur Tetas?</h4>
               <p style={{ margin: 0, fontSize: '0.85rem', color: '#c2410c' }}>Masukkan ke dalam inkubator untuk ditetaskan.</p>
            </div>
            <a href="/admin/inkubator" style={{ textDecoration: 'none', background: '#ea580c', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
               Buka Inkubator
            </a>
          </div>

          {/* TABLE */}
          <div className="table-responsive" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={thStyle}>Tanggal</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Bagus</th>
                  <th style={thStyle}>Rusak</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>{new Date(log.tanggal).toLocaleDateString()}</td>
                    <td style={tdStyle}><strong>{log.jumlah_total}</strong></td>
                    <td style={{ ...tdStyle, color: '#16a34a' }}>{log.jumlah_bagus}</td>
                    <td style={{ ...tdStyle, color: '#dc2626' }}>{log.jumlah_rusak}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleDelete(log.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  outline: 'none',
  fontSize: '1rem'
}

const thStyle = { padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }
const tdStyle = { padding: '12px 16px', color: '#334155', fontSize: '0.9rem' }
