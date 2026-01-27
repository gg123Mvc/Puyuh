import { motion } from 'framer-motion'
import ceo from "./assets/team/ceo.jpeg"
import coo from "./assets/team/coo.jpg"
import director from "./assets/team/director.jpg"
import qa from "./assets/team/qa.jpg"
import bd from "./assets/team/bd.jpg"

export default function Profile() {
  return (
    <>
      <section className="section" style={{ paddingTop: '120px' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 className="title">Tentang Kami</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--gray)', lineHeight: '1.8' }}>
              Peternakan Burung Puyuh Terpadu adalah perusahaan agribisnis yang bergerak
              di bidang produksi telur puyuh, bibit unggul, serta pengembangan sistem
              peternakan modern dan berkelanjutan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section" style={{ background: '#f0f9ff' }}>
        <div className="container">
          <h2 className="title">Tim Kami</h2>
          <div className="grid-3 team-grid">
            <Team img={ceo} name="Ahmad Pratama" role="Founder & CEO" />
            <Team img={coo} name="Siti Nurhaliza" role="Co-Founder & COO" />
            <Team img={director} name="Budi Santoso" role="Director of Production" />
            <Team img={qa} name="Dewi Lestari" role="Quality Assurance Manager" />
            <Team img={bd} name="Rizky Maulana" role="Business Development" />
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="section">
        <div className="container grid-3">
          <div className="card" style={{ gridColumn: 'span 1' }}>
            <h3>Visi</h3>
            <p>
              Menjadi perusahaan peternakan burung puyuh yang unggul, modern,
              dan berdaya saing nasional serta global.
            </p>
          </div>
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center' }}>Misi</h3>
            <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <li style={listItemStyle}>✅ Menghasilkan produk puyuh berkualitas</li>
              <li style={listItemStyle}>✅ Peternakan berbasis teknologi</li>
              <li style={listItemStyle}>✅ Kemitraan berkelanjutan</li>
              <li style={listItemStyle}>✅ Ramah lingkungan</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

const listItemStyle = {
  background: '#f8fafc',
  padding: '12px',
  borderRadius: '8px',
  fontWeight: '500'
}

function Team({ img, name, role }) {
  return (
    <motion.div 
      className="team-card"
      whileHover={{ y: -10 }}
      style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)'
      }}
    >
      <div style={{ 
        width: '120px', 
        height: '120px', 
        margin: '0 auto 20px', 
        borderRadius: '50%', 
        overflow: 'hidden',
        border: '4px solid #eff6ff'
      }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <h3 style={{ marginBottom: '4px', color: 'var(--dark)' }}>{name}</h3>
      <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>{role}</p>
    </motion.div>
  )
}
