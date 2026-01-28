import { motion } from 'framer-motion'
import { Egg, Bird, Wheat, Users, TrendingUp, ShieldCheck, BadgeDollarSign } from 'lucide-react'

export default function Services() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <>
      <header className="header" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ color: 'white' }}
          >
            Produk & Layanan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            Solusi Agribisnis Puyuh Terpadu & Berstandar Industri
          </motion.p>
        </div>
      </header>

      {/* PRODUK */}
      <section className="section">
        <div className="container">
          <h2 className="title">Produk Utama</h2>
          
          <motion.div 
            className="grid-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <ProductCard 
              icon={<Egg size={32} />}
              title="Telur Puyuh Konsumsi"
              desc="Telur puyuh segar dengan standar kebersihan tinggi, cocok untuk kebutuhan rumah tangga, UMKM, dan industri pangan."
              variant={item}
            />
            <ProductCard 
              icon={<Bird size={32} />}
              title="Bibit & Indukan Puyuh"
              desc="Bibit dan indukan puyuh unggul dengan performa produksi optimal, sehat, dan terkontrol."
              variant={item}
            />
            <ProductCard 
              icon={<Wheat size={32} />}
              title="Pakan & Nutrisi"
              desc="Rekomendasi pakan dan formulasi nutrisi untuk meningkatkan produktivitas dan efisiensi ternak."
              variant={item}
            />
          </motion.div>
        </div>
      </section>

      {/* LAYANAN */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className="title">Layanan Kami</h2>

          <div className="grid-3">
            <ServiceItem text="Pendampingan Teknis Peternakan" icon={<Users />} />
            <ServiceItem text="Program Kemitraan Peternak" icon={<BadgeDollarSign />} />
            <ServiceItem text="Konsultasi Manajemen Produksi" icon={<TrendingUp />} />
            <ServiceItem text="Jaminan Penyerapan Hasil Panen" icon={<ShieldCheck />} />
          </div>
        </div>
      </section>
    </>
  )
}

function ProductCard({ title, desc, icon, variant }) {
  return (
    <motion.div 
      className="card"
      variants={variant}
      whileHover={{ y: -10, boxShadow: 'var(--shadow-hover)' }}
    >
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  )
}

function ServiceItem({ text, icon }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, background: 'var(--primary)', color: 'white' }}
      transition={{ duration: 0.3 }}
      style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
        fontWeight: '600',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        cursor: 'default'
      }}
    >
      <div style={{ padding: '12px', background: 'rgba(37,99,235,0.1)', borderRadius: '50%', color: 'inherit' }}>
        {icon}
      </div>
      {text}
    </motion.div>
  )
}
