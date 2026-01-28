import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Plus, Trash2, Edit } from 'lucide-react'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ConfirmDialog'

export default function PembelianManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nama_barang: '',
    kategori: 'pakan',
    jumlah: '',
    satuan: 'sak',
    harga_total: '',
    keterangan: '',
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
    
    const action = editingId ? 'Update Transaksi' : 'Simpan Transaksi'
    const isConfirmed = await confirm(
      `Yakin ingin ${action.toLowerCase()}?`, 
      action, 
      { variant: 'confirm', confirmLabel: editingId ? 'Update' : 'Simpan' }
    )
    if (!isConfirmed) return

    let error
    if (editingId) {
      // UPDATE
      const { error: err } = await supabase
        .from('pembelian')
        .update(formData)
        .eq('id', editingId)
      error = err
    } else {
      // INSERT
      const { error: err } = await supabase.from('pembelian').insert([formData])
      error = err
    }

    if (!error) {
      resetForm()
      fetchItems()
      showToast('Data Transaksi Berhasil Disimpan', 'success')
    } else {
      showToast('Gagal simpan: ' + error.message, 'error')
    }
  }

  const handleEdit = (item) => {
    setFormData({
      nama_barang: item.nama_barang,
      kategori: item.kategori,
      jumlah: item.jumlah,
      satuan: item.satuan,
      harga_total: item.harga_total,
      keterangan: item.keterangan || ''
    })
    setEditingId(item.id)
  }

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Yakin ingin menghapus data pembelian ini? Data yang dihapus tidak bisa dikembalikan.')
    if (isConfirmed) {
      const { error } = await supabase.from('pembelian').delete().eq('id', id)
      if (!error) {
        fetchItems()
        showToast('Data berhasil dihapus', 'success')
      } else {
        showToast('Gagal hapus: ' + error.message, 'error')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nama_barang: '',
      kategori: 'pakan',
      jumlah: '',
      satuan: 'sak',
      harga_total: '',
      keterangan: '',
    })
    setEditingId(null)
  }

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>Riwayat Pembelian</h1>

      {/* FORM */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>{editingId ? 'Edit Pembelian' : 'Input Pembelian Baru'}</h3>
          {editingId && (
            <button onClick={resetForm} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
              Batal Edit
            </button>
          )}
        </div>
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
              <option value="telur_tetas">Telur Tetas</option>
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
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Keterangan / Catatan</label>
            <textarea 
              rows="2"
              placeholder="Tambahkan catatan pembelian (opsional)..."
              value={formData.keterangan}
              onChange={e => setFormData({...formData, keterangan: e.target.value})}
              style={{ ...inputStyle, fontFamily: 'inherit' }}
            />
          </div>
          <button type="submit" className="btn" style={{ height: '42px', justifyContent: 'center', background: editingId ? '#f59e0b' : 'var(--primary)' }}>
            {editingId ? <Edit size={18} /> : <Plus size={18} />} {editingId ? 'Update' : 'Simpan'}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="table-responsive" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Barang</th>
              <th style={thStyle}>Kategori</th>
              <th style={thStyle}>Jumlah</th>
              <th style={thStyle}>Total Harga</th>
              <th style={thStyle}>Aksi</th>
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
                    background: item.kategori === 'pakan' ? '#ecfccb' : item.kategori === 'obat' ? '#e0f2fe' : item.kategori === 'telur_tetas' ? '#fff7ed' : '#f3f4f6',
                    color: item.kategori === 'pakan' ? '#3f6212' : item.kategori === 'obat' ? '#0369a1' : item.kategori === 'telur_tetas' ? '#c2410c' : '#4b5563',
                    textTransform: 'capitalize'
                  }}>
                    {item.kategori}
                  </span>
                </td>
                <td style={tdStyle}>{item.jumlah} {item.satuan}</td>
                <td style={tdStyle}>Rp {parseInt(item.harga_total).toLocaleString()}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(item)} style={{ ...actionBtnStyle, color: '#3b82f6' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} style={{ ...actionBtnStyle, color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
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
const actionBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }
