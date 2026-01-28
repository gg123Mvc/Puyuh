import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { Trash2, Plus, Edit, MinusCircle, X } from 'lucide-react'

import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ConfirmDialog'

export default function KandangManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const { user } = useOutletContext() // Get logged in user
  const [cages, setCages] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Main Form (Add/Edit)
  const [formData, setFormData] = useState({ nama_kandang: '', kapasitas: '', jumlah_puyuh: '' })
  const [editingId, setEditingId] = useState(null)

  // Reduction Modal State
  const [reduceModal, setReduceModal] = useState({ open: false, kandangId: null, namaKandang: '' })
  const [reduceData, setReduceData] = useState({ 
    jumlah: '', 
    alasan: 'Mati', // Default
    keterangan: '' 
  })

  useEffect(() => {
    fetchCages()
  }, [])

  const fetchCages = async () => {
    setLoading(true)
    const { data } = await supabase.from('kandang').select('*').order('id')
    if (data) setCages(data)
    setLoading(false)
  }

  // --- CRUD HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nama_kandang || !formData.kapasitas) return

    const action = editingId ? 'Update Data' : 'Tambah Kandang'
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
        .from('kandang')
        .update(formData)
        .eq('id', editingId)
      error = err
    } else {
      // INSERT
      const { error: err } = await supabase.from('kandang').insert([formData])
      error = err
    }
    
    if (!error) {
      resetForm()
      fetchCages()
      showToast(editingId ? 'Kandang berhasil diupdate' : 'Kandang baru ditambahkan', 'success')
    } else {
      showToast('Gagal simpan: ' + error.message, 'error')
    }
  }

  const handleEdit = (item) => {
    setFormData({
      nama_kandang: item.nama_kandang,
      kapasitas: item.kapasitas,
      jumlah_puyuh: item.jumlah_puyuh
    })
    setEditingId(item.id)
  }

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Yakin hapus data kandang ini? (Tidak disarankan jika ada riwayat)')
    if (isConfirmed) {
      const { error } = await supabase.from('kandang').delete().eq('id', id)
      if (!error) {
        fetchCages()
        showToast('Kandang berhasil dihapus', 'success')
      } else {
        showToast('Gagal hapus: ' + error.message, 'error')
      }
    }
  }

  const resetForm = () => {
    setFormData({ nama_kandang: '', kapasitas: '', jumlah_puyuh: '' })
    setEditingId(null)
  }

  // --- POPULATION REDUCTION HANDLERS ---
  const openReduceModal = (kandang) => {
    setReduceModal({ open: true, kandangId: kandang.id, namaKandang: kandang.nama_kandang })
    setReduceData({ jumlah: '', alasan: 'Mati', keterangan: '' })
  }

  const handleReduceSubmit = async (e) => {
    e.preventDefault()
    const amount = parseInt(reduceData.jumlah)
    if (!amount || amount <= 0) return showToast('Jumlah harus > 0', 'error')

    const isConfirmed = await confirm(
      `Yakin mengurangi populasi sebesar ${amount} ekor?`, 
      'Konfirmasi Pengurangan', 
      { variant: 'warning', confirmLabel: 'Kurangi' }
    )
    if (!isConfirmed) return

    const { kandangId } = reduceModal
    
    // 1. Get current count
    const kandang = cages.find(c => c.id === kandangId)
    if (!kandang) return

    if (kandang.jumlah_puyuh < amount) {
      return showToast('Jumlah pengurangan melebihi populasi saat ini!', 'error')
    }

    const newCount = kandang.jumlah_puyuh - amount

    // 2. Update Kandang
    const { error: updateError } = await supabase
      .from('kandang')
      .update({ jumlah_puyuh: newCount })
      .eq('id', kandangId)

    if (updateError) return showToast('Gagal update kandang: ' + updateError.message, 'error')

    // 3. Insert Log (Best Effort)
    // We assume table 'riwayat_populasi' exists. If not, it might fail silently or error, but kandang is updated.
    const logEntry = {
      kandang_id: kandangId,
      jumlah: amount,
      jenis_perubahan: 'pengurangan',
      alasan: reduceData.alasan,
      keterangan: reduceData.keterangan || '-',
      user_input: user?.user_metadata?.full_name || user?.email || 'Unknown', // Log Name if available
      created_at: new Date()
    }

    // Try to insert log
    const { error: logError } = await supabase.from('riwayat_populasi').insert([logEntry])
    
    if (logError) {
      console.warn('Logging failed (table might be missing):', logError)
      showToast('Populasi berkurang, namun gagal mencatat riwayat.', 'info')
    } else {
      showToast('Data pengurangan berhasil disimpan!', 'success')
    }

    setReduceModal({ open: false, kandangId: null, namaKandang: '' })
    fetchCages()
  }

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>Manajemen Kandang</h1>

      {/* FORM INPUT */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>{editingId ? 'Edit Kandang' : 'Tambah Kandang Baru'}</h3>
          {editingId && (
            <button onClick={resetForm} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
              Batal Edit
            </button>
          )}
        </div>
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
          <button type="submit" className="btn" style={{ justifyContent: 'center', background: editingId ? '#f59e0b' : 'var(--primary)' }}>
            {editingId ? <Edit size={18} /> : <Plus size={18} />} {editingId ? 'Update' : 'Tambah'}
          </button>
        </form>
      </div>

      {/* MODAL REDUCE POPULATION */}
      {reduceModal.open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Kurangi Populasi ({reduceModal.namaKandang})</h3>
              <button 
                onClick={() => setReduceModal({...reduceModal, open: false})}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleReduceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Jumlah Berkurang</label>
                <input 
                  type="number" required min="1"
                  value={reduceData.jumlah}
                  onChange={e => setReduceData({...reduceData, jumlah: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Alasan</label>
                <select 
                  style={inputStyle}
                  value={reduceData.alasan}
                  onChange={e => setReduceData({...reduceData, alasan: e.target.value})}
                >
                  <option value="Mati">Mati</option>
                  <option value="Hilang">Hilang</option>
                  <option value="Dimakan Hewan">Dimakan Hewan</option>
                  <option value="Dikonsumsi Sendiri">Dikonsumsi Sendiri</option>
                  <option value="Dijual Eceran">Dijual Eceran</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Keterangan / Input Oleh</label>
                <textarea 
                  rows="2"
                  placeholder="Catatan tambahan..."
                  value={reduceData.keterangan}
                  onChange={e => setReduceData({...reduceData, keterangan: e.target.value})}
                  style={{ ...inputStyle, fontFamily: 'inherit' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Akan tercatat input oleh: <strong>{user?.email}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setReduceModal({...reduceModal, open: false})}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE LIST */}
      <div className="table-responsive" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
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
                      title="Kurangi Populasi"
                      onClick={() => openReduceModal(kandang)}
                      style={{ ...actionBtnStyle, background: '#fee2e2', color: '#ef4444' }}
                    >
                      <MinusCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(kandang)}
                      style={{ ...actionBtnStyle, color: '#3b82f6' }}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(kandang.id)}
                      style={{ ...actionBtnStyle, color: '#94a3b8' }}
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
      {/* HISTORY TABLE */}
      <div className="table-responsive" style={{ marginTop: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>Riwayat Perubahan Populasi</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Kandang</th>
              <th style={thStyle}>Perubahan</th>
              <th style={thStyle}>Alasan</th>
              <th style={thStyle}>Oleh</th>
            </tr>
          </thead>
          <tbody>
            <HistoryRows />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function HistoryRows() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    // Join with kandang to get names
    const { data } = await supabase
      .from('riwayat_populasi')
      .select('*, kandang:kandang_id(nama_kandang)')
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (data) setLogs(data)
    setLoading(false)
  }

  if (loading) return <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Memuat riwayat...</td></tr>
  if (logs.length === 0) return <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Belum ada riwayat</td></tr>

  return logs.map(log => (
    <tr key={log.id} style={{ borderTop: '1px solid #f1f5f9' }}>
      <td style={tdStyle}>
        {new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </td>
      <td style={tdStyle}><strong>{log.kandang?.nama_kandang || 'Unknown'}</strong></td>
      <td style={tdStyle}>
        <span style={{ 
          color: log.jenis_perubahan === 'pengurangan' ? '#ef4444' : '#10b981',
          fontWeight: 'bold'
        }}>
          {log.jenis_perubahan === 'pengurangan' ? '-' : '+'}{log.jumlah}
        </span>
      </td>
      <td style={tdStyle}>
        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{log.alasan || '-'}</div>
        {log.keterangan && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{log.keterangan}</div>}
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: '0.85rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
          {log.user_input}
        </span>
      </td>
    </tr>
  ))
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
  border: 'none',
  cursor: 'pointer',
  marginRight: '8px',
  padding: '8px',
  borderRadius: '6px',
  transition: 'background 0.2s',
  background: 'transparent'
}
