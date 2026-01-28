import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { ThermometerSun, Plus, Trash2, Egg, Clock } from 'lucide-react'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ConfirmDialog'

export default function InkubatorManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    tanggal_masuk: new Date().toISOString().split('T')[0],
    jumlah_telur: '',
    sumber: 'produksi', // or 'beli'
  })

  useEffect(() => {
    fetchBatches()
  }, [])

  const fetchBatches = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('inkubator')
      .select('*')
      .order('estimasi_menetas', { ascending: true })
    
    if (data) setBatches(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Auto Calculate Hatch Date (17 Days for Quail)
    const dateIn = new Date(formData.tanggal_masuk)
    const hatchDate = new Date(dateIn)
    hatchDate.setDate(dateIn.getDate() + 17)

    const payload = {
      tanggal_masuk: formData.tanggal_masuk,
      jumlah_telur: parseInt(formData.jumlah_telur),
      sumber: formData.sumber,
      estimasi_menetas: hatchDate.toISOString().split('T')[0],
      status: 'inkubasi'
    }

    const isConfirmed = await confirm(
      `Masukkan ${payload.jumlah_telur} telur ke inkubator? Estimasi menetas: ${payload.estimasi_menetas}`, 
      'Konfirmasi Inkubasi', 
      { variant: 'confirm', confirmLabel: 'Simpan' }
    )
    if (!isConfirmed) return

    const { error } = await supabase.from('inkubator').insert([payload])

    if (!error) {
      setFormData({ ...formData, jumlah_telur: '' })
      fetchBatches()
      showToast(`Telur masuk inkubator! (Hatch: ${payload.estimasi_menetas})`, 'success')
    } else {
      showToast('Gagal simpan: ' + error.message, 'error')
    }
  }

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Hapus data inkubasi ini? Data yang dihapus permanen.')
    if (isConfirmed) {
      const { error } = await supabase.from('inkubator').delete().eq('id', id)
      if (!error) {
        fetchBatches()
        showToast('Data inkubator dihapus', 'info')
      }
    }
  }

  const getDaysRemaining = (targetDate) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'left', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ThermometerSun color="#ea580c" /> Manajemen Inkubator
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* INPUT FORM */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Egg size={20} color="#ea580c" /> Masukkan Telur
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Tanggal Masuk</label>
              <input 
                type="date" required
                value={formData.tanggal_masuk}
                onChange={e => setFormData({...formData, tanggal_masuk: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Jumlah Telur</label>
              <input 
                type="number" required placeholder="0" min="1"
                value={formData.jumlah_telur}
                onChange={e => setFormData({...formData, jumlah_telur: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Sumber Telur</label>
              <select 
                value={formData.sumber}
                onChange={e => setFormData({...formData, sumber: e.target.value})}
                style={inputStyle}
              >
                <option value="produksi">Produksi Sendiri</option>
                <option value="beli">Beli (Bibit/Tetas)</option>
              </select>
            </div>
            
            <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '8px', border: '1px solid #fdba74' }}>
              <p style={{ fontSize: '0.9rem', color: '#9a3412', margin: 0 }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/>
                Estimasi menetas: <strong>17 Hari</strong> dari tanggal masuk.
              </p>
            </div>

            <button type="submit" className="btn" style={{ justifyContent: 'center', background: '#ea580c', color: 'white' }}>
              <Plus size={18} /> Masukkan Inkubator
            </button>
          </form>
        </div>

        {/* BATCH LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? <p>Memuat data...</p> : batches.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', color: '#94a3b8' }}>
              <ThermometerSun size={48} style={{ opacity: 0.2 }} />
              <p>Inkubator kosong</p>
            </div>
          ) : (
            batches.map(batch => {
              const daysLeft = getDaysRemaining(batch.estimasi_menetas)
              const isHatching = daysLeft <= 0
              
              return (
                <div key={batch.id} style={{ 
                  background: 'white', padding: '20px', borderRadius: '16px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  borderLeft: `5px solid ${isHatching ? '#16a34a' : '#ea580c'}`,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1e293b' }}>
                        Batch #{batch.id} 
                        <span style={{ 
                          fontSize: '0.75rem', fontWeight: 'normal', 
                          background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px'
                        }}>
                          {batch.sumber === 'beli' ? 'Beli' : 'Produksi'}
                        </span>
                      </h4>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                        Masuk: {new Date(batch.tanggal_masuk).toLocaleDateString()} • <strong>{batch.jumlah_telur} Butir</strong>
                      </p>
                    </div>
                    <button onClick={() => handleDelete(batch.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isHatching ? '#f0fdf4' : '#fff7ed', padding: '10px 14px', borderRadius: '8px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isHatching ? '#15803d' : '#9a3412' }}>
                        {isHatching ? <Egg size={20} /> : <Clock size={20} />}
                        <span style={{ fontWeight: '600' }}>
                          {isHatching ? 'SIAP MENETAS / SUDAH MENETAS' : `Menetas dalam ${daysLeft} hari`}
                        </span>
                     </div>
                     <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}>
                        {new Date(batch.estimasi_menetas).toLocaleDateString()}
                     </span>
                  </div>
                </div>
              )
            })
          )}
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
