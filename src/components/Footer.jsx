import React from 'react'
import { motion } from 'framer-motion'
import { Twitter } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const handleTwitterClick = () => {
    window.open('https://x.com/Cassini0x', '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.footer 
      className="app-footer"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
    >
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-text">
            Built with <img src="/raindrop.png" alt="💜" className="footer-icon" /> for Monad Community
          </p>
        </div>
        
        <div className="footer-right">
          <motion.button
            className="cassini-button"
            onClick={handleTwitterClick}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Twitter size={16} />
            <span>Built by Cassini</span>
          </motion.button>
        </div>
      </div>
      
      <motion.div 
        className="footer-glow"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.footer>
  )
}

export default Footer 