import React from 'react'
import { motion } from 'framer-motion'
import { Network } from 'lucide-react'
import './Header.css'

const Header = () => {
  return (
    <motion.header 
      className="app-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="header-content">
        <div className="logo-section">
          <motion.div 
            className="logo-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src="/monad_logo.png" 
              alt="Monad Logo" 
              className="logo-image"
            />
          </motion.div>
          <div className="logo-text">
            <h1 className="app-title">Purple Rain</h1>
            <p className="app-subtitle">Monad Blockchain Visualization</p>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <Network className="stat-icon" size={16} />
            <span>Monad Testnet</span>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="header-glow"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.header>
  )
}

export default Header 