import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Plus } from 'lucide-react'

export default function PakanManager() {
  const [logs, setLogs] = useState([])
  const [cages, setCages] = useState([])
  const [formData, setFormData] = useState({
    kandang_id: '',
    jumlah_pakan: '',
    jenis_pakan: 'konsentrat',
    catatan: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: logsData } = await supabase
      .from('pemberian_pakan')
      .select(`*, kandang:kandang_id(nama_kandang)`)
      .order('tanggal', { ascending: false })
    
    const { data: cagesData } = await supabase.from('kandang').select('id, nama_kandang')

    if (logsData) setLogs(logsData)
    if (cagesData) setCages(cagesData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('pemberian_pakan').insert([formData])
    if (!error) {
      setFormData({ kandang_id: '', jumlah_pakan: '', jenis_pakan: 'konsentrat', catatan: '' })
      fetchData()
    } else {
      alert('Gagal simpan: ' + error.message)
    }
  }

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>Jadwal Pemberian Pakan</h1>

      {/* FORM */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '16px' }}>Catat Pemberian Pakan</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Pilih Kandang</label>
            <select 
              required
              value={formData.kandang_id}
              onChange={e => setFormData({...formData, kandang_id: e.target.value})}
              style={inputStyle}
            >
              <option value="">-- Pilih Kandang --</option>
              {cages.map(c => (
                <option key={c.id} value={c.id}>{c.nama_kandang}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Jumlah (kg)</label>
            <input 
              type="number" 
              required
              value={formData.jumlah_pakan}
              onChange={e => setFormData({...formData, jumlah_pakan: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Jenis Pakan</label>
            <input 
              type="text" 
              required
              value={formData.jenis_pakan}
              onChange={e => setFormData({...formData, jenis_pakan: e.target.value})}
              style={inputStyle}
            />
          </div>
          <button type="submit" className="btn" style={{ height: '42px', justifyContent: 'center' }}>
            <Plus size={18} /> Simpan
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={thStyle}>Waktu</th>
              <th style={thStyle}>Kandang</th>
              <th style={thStyle}>Jumlah</th>
              <th style={thStyle}>Jenis</th>
              <th style={thStyle}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>{new Date(log.tanggal).toLocaleString()}</td>
                <td style={tdStyle}><strong>{log.kandang?.nama_kandang}</strong></td>
                <td style={tdStyle}>{log.jumlah_pakan} kg</td>
                <td style={tdStyle}>{log.jenis_pakan}</td>
                <td style={tdStyle}>{log.catatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  outline: 'none'
}
const thStyle = { padding: '16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }
const tdStyle = { padding: '16px', color: '#334155' }
