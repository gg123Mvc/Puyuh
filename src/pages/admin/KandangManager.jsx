import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Trash2, Plus, Edit } from 'lucide-react'

export default function KandangManager() {
  const [cages, setCages] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ nama_kandang: '', kapasitas: '', jumlah_puyuh: '' })

  useEffect(() => {
    fetchCages()
  }, [])

  const fetchCages = async () => {
    setLoading(true)
    const { data } = await supabase.from('kandang').select('*').order('id')
    if (data) setCages(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nama_kandang || !formData.kapasitas) return

    const { error } = await supabase.from('kandang').insert([formData])
    
    if (!error) {
      setFormData({ nama_kandang: '', kapasitas: '', jumlah_puyuh: '' })
      fetchCages()
    } else {
      alert('Gagal menambahkan kandang: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus kandang ini?')) {
      const { error } = await supabase.from('kandang').delete().eq('id', id)
      if (!error) fetchCages()
    }
  }

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>Manajemen Kandang</h1>

      {/* FORM INPUT */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '16px' }}>Tambah Kandang Baru</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Nama Kandang</label>
            <input 
              type="text" 
              placeholder="Contoh: Kandang A1" 
              value={formData.nama_kandang}
              onChange={e => setFormData({...formData, nama_kandang: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Kapasitas (Ekor)</label>
            <input 
              type="number" 
              placeholder="1000" 
              value={formData.kapasitas}
              onChange={e => setFormData({...formData, kapasitas: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Jumlah Awal (Opsional)</label>
            <input 
              type="number" 
              placeholder="0" 
              value={formData.jumlah_puyuh}
              onChange={e => setFormData({...formData, jumlah_puyuh: e.target.value})}
              style={inputStyle}
            />
          </div>
          <button type="submit" className="btn" style={{ justifyContent: 'center' }}>
            <Plus size={18} /> Tambah
          </button>
        </form>
      </div>

      {/* TABLE LIST */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nama Kandang</th>
              <th style={thStyle}>Kapasitas</th>
              <th style={thStyle}>Populasi Saat Ini</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Memuat data...</td></tr>
            ) : cages.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Belum ada data kandang</td></tr>
            ) : (
              cages.map((kandang) => (
                <tr key={kandang.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>#{kandang.id}</td>
                  <td style={tdStyle}><strong>{kandang.nama_kandang}</strong></td>
                  <td style={tdStyle}>{kandang.kapasitas} ekor</td>
                  <td style={tdStyle}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      background: kandang.jumlah_puyuh > kandang.kapasitas ? '#fef2f2' : '#f0fdf4',
                      color: kandang.jumlah_puyuh > kandang.kapasitas ? '#ef4444' : '#15803d',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      {kandang.jumlah_puyuh} ekor
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => alert('Fitur edit segera hadir')}
                      style={{ ...actionBtnStyle, color: '#3b82f6' }}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(kandang.id)}
                      style={{ ...actionBtnStyle, color: '#ef4444' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  outline: 'none'
}

const thStyle = {
  padding: '16px',
  textAlign: 'left',
  borderBottom: '1px solid #e2e8f0',
  color: '#64748b',
  fontWeight: '600'
}

const tdStyle = {
  padding: '16px',
  color: '#334155'
}

const actionBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  marginRight: '8px',
  padding: '6px',
  borderRadius: '4px',
  transition: 'background 0.2s'
}
