import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Plus, Trash2 } from 'lucide-react'

export default function PembelianManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nama_barang: '',
    kategori: 'pakan',
    jumlah: '',
    satuan: 'sak',
    harga_total: '',
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('pembelian').select('*').order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('pembelian').insert([formData])
    if (!error) {
      setFormData({
        nama_barang: '',
        kategori: 'pakan',
        jumlah: '',
        satuan: 'sak',
        harga_total: '',
      })
      fetchItems()
    } else {
      alert('Gagal simpan: ' + error.message)
    }
  }

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>Riwayat Pembelian</h1>

      {/* FORM */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '16px' }}>Input Pembelian Baru</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Nama Barang</label>
            <input 
              type="text" 
              required
              value={formData.nama_barang}
              onChange={e => setFormData({...formData, nama_barang: e.target.value})}
              style={inputStyle}
              placeholder="Contoh: Pakan Startil H5"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Kategori</label>
            <select 
              value={formData.kategori}
              onChange={e => setFormData({...formData, kategori: e.target.value})}
              style={inputStyle}
            >
              <option value="pakan">Pakan</option>
              <option value="obat">Obat & Vitamin</option>
              <option value="perlengkapan">Perlengkapan</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Jumlah</label>
            <input 
              type="number" 
              required
              value={formData.jumlah}
              onChange={e => setFormData({...formData, jumlah: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Satuan</label>
            <input 
              type="text" 
              required
              value={formData.satuan}
              onChange={e => setFormData({...formData, satuan: e.target.value})}
              style={inputStyle}
              placeholder="kg/sak/pcs"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Total Harga (Rp)</label>
            <input 
              type="number" 
              required
              value={formData.harga_total}
              onChange={e => setFormData({...formData, harga_total: e.target.value})}
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
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Barang</th>
              <th style={thStyle}>Kategori</th>
              <th style={thStyle}>Jumlah</th>
              <th style={thStyle}>Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>{item.tanggal}</td>
                <td style={tdStyle}><strong>{item.nama_barang}</strong></td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    background: item.kategori === 'pakan' ? '#ecfccb' : item.kategori === 'obat' ? '#e0f2fe' : '#f3f4f6',
                    color: item.kategori === 'pakan' ? '#3f6212' : item.kategori === 'obat' ? '#0369a1' : '#4b5563',
                    textTransform: 'capitalize'
                  }}>
                    {item.kategori}
                  </span>
                </td>
                <td style={tdStyle}>{item.jumlah} {item.satuan}</td>
                <td style={tdStyle}>Rp {parseInt(item.harga_total).toLocaleString()}</td>
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
