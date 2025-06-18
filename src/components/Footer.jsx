import React from 'react'
import { motion } from 'framer-motion'
import { Twitter } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const handleTwitterClick = () => {
    window.open('https://x.com/Cassini0x', '_blank', 'noopener,noreferrer')
  }

  const transactionTypes = [
    { name: 'Transfer', icon: '/drops/transfer.png', color: '#4ECDC4' },
    { name: 'DeFi', icon: '/drops/defi.png', color: '#00D4AA' },
    { name: 'Contract Call', icon: '/drops/contract-call.png', color: '#45B7D1' },
    { name: 'NFT', icon: '/drops/nft.png', color: '#FF6B6B' },
    { name: 'Other', icon: '/drops/other.png', color: '#FECA57' },
    { name: 'Contract Deploy', icon: '/drops/contract-deploy.png', color: '#96CEB4' }
  ]

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
            Built with <img src="/monad_logo.png" alt=" 💜 " className="footer-icon" /> for Monad Community
          </p>
        </div>
        
        {/* Transaction Types Legend */}
        <div className="transaction-legend">
          <span className="legend-title">Transaction Types:</span>
          <div className="legend-items">
            {transactionTypes.map((type, index) => (
              <motion.div
                key={type.name}
                className="legend-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={type.icon} 
                  alt={type.name}
                  className="legend-icon"
                  style={{ filter: `drop-shadow(0 0 2px ${type.color}66)` }}
                />
                <span className="legend-text" style={{ color: type.color }}>
                  {type.name}
                </span>
              </motion.div>
            ))}
          </div>
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