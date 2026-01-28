import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ConfirmDialog'

export default function PakanManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [logs, setLogs] = useState([])
  const [cages, setCages] = useState([])
  const [editingId, setEditingId] = useState(null)
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
    
    const action = editingId ? 'Update Data Pakan' : 'Catat Pemberian Pakan'
    const isConfirmed = await confirm(
      `Yakin ingin ${editingId ? 'mengupdate' : 'menyimpan'} data ini?`, 
      action, 
      { variant: 'confirm', confirmLabel: editingId ? 'Update' : 'Simpan' }
    )
    if (!isConfirmed) return

    let error
    if (editingId) {
      // UPDATE
      const { error: err } = await supabase
        .from('pemberian_pakan')
        .update(formData)
        .eq('id', editingId)
      error = err
    } else {
      // INSERT
      const { error: err } = await supabase.from('pemberian_pakan').insert([formData])
      error = err
    }

    if (!error) {
      resetForm()
      fetchData()
      showToast('Data Pakan Berhasil Disimpan', 'success')
    } else {
      showToast('Gagal simpan: ' + error.message, 'error')
    }
  }

  const handleEdit = (log) => {
    setFormData({
      kandang_id: log.kandang_id,
      jumlah_pakan: log.jumlah_pakan,
      jenis_pakan: log.jenis_pakan,
      catatan: log.catatan || ''
    })
    setEditingId(log.id)
  }

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Hapus data pemberian pakan ini?')
    if (isConfirmed) {
      const { error } = await supabase.from('pemberian_pakan').delete().eq('id', id)
      if (!error) {
        fetchData()
        showToast('Data berhasil dihapus', 'success')
      } else {
        showToast('Gagal hapus: ' + error.message, 'error')
      }
    }
  }

  const resetForm = () => {
    setFormData({ kandang_id: '', jumlah_pakan: '', jenis_pakan: 'konsentrat', catatan: '' })
    setEditingId(null)
  }

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>Jadwal Pemberian Pakan</h1>

      {/* FORM */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>{editingId ? 'Edit Pemberian Pakan' : 'Catat Pemberian Pakan'}</h3>
          {editingId && (
            <button onClick={resetForm} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
              Batal Edit
            </button>
          )}
        </div>
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
              <th style={thStyle}>Waktu</th>
              <th style={thStyle}>Kandang</th>
              <th style={thStyle}>Jumlah</th>
              <th style={thStyle}>Jenis</th>
              <th style={thStyle}>Catatan</th>
              <th style={thStyle}>Aksi</th>
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
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(log)} style={{ ...actionBtnStyle, color: '#3b82f6' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(log.id)} style={{ ...actionBtnStyle, color: '#ef4444' }}>
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
