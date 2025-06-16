import React from 'react'
import { motion } from 'framer-motion'
import { useMonad } from '../contexts/MonadContext'
import { TrendingUp, Hash, Zap, Coins, Image, ArrowRightLeft, Code, Package, HelpCircle } from 'lucide-react'
import './Stats.css'

const Stats = () => {
  const { stats, latestBlock } = useMonad()

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const categoryStats = stats.categoryStats || {}
  
  const statsData = [
    {
      icon: TrendingUp,
      label: 'TPS',
      value: ` ${stats.blockTransactions || 0}`,
      color: '#00ffff',
      animate: true
    },
    {
      icon: Hash,
      label: 'Total Transactions',
      value: formatNumber(stats.totalTransactions),
      color: '#8B5CF6',
      animate: false
    },
    {
      icon: Coins,
      label: 'DeFi Operations',
      value: categoryStats.defi || 0,
      color: '#00D4AA',
      animate: true
    },
    {
      icon: Image,
      label: 'NFT Operations',
      value: categoryStats.nft || 0,
      color: '#FF6B6B',
      animate: false
    },
    {
      icon: ArrowRightLeft,
      label: 'Transfers',
      value: categoryStats.transfer || 0,
      color: '#4ECDC4',
      animate: false
    },
    {
      icon: Code,
      label: 'Contract Calls',
      value: categoryStats.contractCall || 0,
      color: '#45B7D1',
      animate: false
    },
    {
      icon: Package,
      label: 'Contract Deploys',
      value: categoryStats.contractDeploy || 0,
      color: '#96CEB4',
      animate: false
    },
    {
      icon: HelpCircle,
      label: 'Other',
      value: categoryStats.other || 0,
      color: '#FECA57',
      animate: false
    }
  ]

  return (
    <>
      {/* Network Statistics - Keep in original position */}
      <motion.div 
        className="stats-panel"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      >
        <div className="stats-header">
          <h3>Network Statistics</h3>
          {latestBlock && (
            <div className="latest-block">
              Block #{latestBlock.number?.toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon-wrapper">
                <stat.icon 
                  className="stat-icon" 
                  size={20} 
                  style={{ color: stat.color }}
                />
              </div>
              
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <motion.div 
                  className="stat-value"
                  animate={stat.animate ? { 
                    scale: [1, 1.1, 1],
                    color: [stat.color, '#ffffff', stat.color]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Network Health */}
        <div className="network-health">
          <div className="health-indicator">
            <div className="health-dot pulsing" />
            <span>Network Healthy</span>
          </div>
          <div className="hash-display">
            {stats.networkHash}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Stats 