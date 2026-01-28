import { motion } from 'framer-motion'
import { ArrowRight, Leaf, TrendingUp, ShieldCheck, Truck, Globe } from 'lucide-react'
import puyuhVideo from './assets/puyuh.mp4'

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <video autoPlay muted loop playsInline>
            <source src={puyuhVideo} type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Peternakan Burung Puyuh Modern & Terstandar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Sistem manajemen modern, biosekuriti ketat, dan efisiensi produksi untuk pasar global.
          </motion.p>
          <motion.a 
            href="#contact" 
            className="btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Kerja Sama & Kemitraan <ArrowRight size={20} />
          </motion.a>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section" id="about">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="title">Profil Perusahaan</h2>
            <p className="subtitle">
              Kami berdedikasi untuk menghadirkan produk puyuh terbaik melalui inovasi dan keberlanjutan.
            </p>
            <p className="subtitle" style={{ fontSize: '1.2rem', color: 'var(--dark)' }}>
              "Menjadi pelopor industri puyuh modern yang mengedepankan kualitas, kesejahteraan hewan, dan kepuasan mitra."
            </p>
          </motion.div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section" style={{ background: '#f0f9ff' }} id="services">
        <div className="container">
          <h2 className="title">Layanan Unggulan</h2>
          <div className="grid-3">
            <ServiceCard 
              title="Produksi Telur" 
              desc="Telur segar berkualitas premium, bebas residu antibiotik, dan kaya nutrisi untuk kebutuhan keluarga."
              delay={0}
            />
            <ServiceCard 
              title="Bibit Unggul" 
              desc="Day Old Quail (DOQ) dengan genetika terbaik, daya tahan tinggi, dan pertumbuhan cepat."
              delay={0.2}
            />
            <ServiceCard 
              title="Kemitraan" 
              desc="Program pendampingan menyeluruh mulai dari kandang, pakan, hingga pemasaran hasil panen."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <h2 className="title">Keunggulan Kami</h2>
          <div className="grid-3">
            <FeatureItem icon={<Leaf />} text="Ramah Lingkungan" />
            <FeatureItem icon={<TrendingUp />} text="Manajemen Modern" />
            <FeatureItem icon={<Globe />} text="Standar Global" />
            <FeatureItem icon={<ShieldCheck />} text="Biosekuriti Ketat" />
            <FeatureItem icon={<Truck />} text="Distribusi Cepat" />
            <FeatureItem icon={<ArrowRight />} text="Layanan 24/7" />
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section" id="contact" style={{ background: 'var(--primary)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="title" style={{ color: 'white', WebkitTextFillColor: 'white', backgroundImage: 'none' }}>
            Siap Bermitra Dengan Kami?
          </h2>
          <p style={{ marginBottom: '30px', fontSize: '1.2rem', opacity: 0.9 }}>
            Hubungi tim kami untuk konsultasi gratis mengenai peluang bisnis puyuh.
          </p>
          <motion.a 
            href="https://wa.me/628xxxxxxxxxx" 
            className="btn"
            style={{ background: 'white', color: 'var(--primary)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hubungi via WhatsApp
          </motion.a>
        </div>
      </section>
    </>
  )
}

function ServiceCard({ title, desc, delay }) {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  )
}

function FeatureItem({ icon, text }) {
  return (
    <motion.div 
      className="feature-item"
      whileHover={{ scale: 1.05, color: 'var(--primary)' }}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        fontSize: '1.1rem', 
        fontWeight: 600,
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: 'var(--shadow)'
      }}
    >
      <span style={{ color: 'var(--primary)' }}>{icon}</span>
      {text}
    </motion.div>
  )
}
