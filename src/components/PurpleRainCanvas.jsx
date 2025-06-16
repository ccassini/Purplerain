import React, { useEffect, useRef, useState } from 'react'
import { useMonad } from '../contexts/MonadContext'
import { logger } from '../utils/logger'
import './PurpleRainCanvas.css'

const PurpleRainCanvas = () => {
  const { transactions, stats } = useMonad()
  const containerRef = useRef(null)
  const [rainDrops, setRainDrops] = useState([])
  const [dropCounter, setDropCounter] = useState(0)
  
  const getImageForCategory = (category) => {
    const images = {
      defi: '/drops/defi.png',
      nft: '/drops/nft.png', 
      transfer: '/drops/transfer.png',
      contractCall: '/drops/contract-call.png',
      contractDeploy: '/drops/contract-deploy.png',
      other: '/drops/other.png'
    }
    return images[category] || '/drops/other.png'
  }
  
  const getColorForCategory = (category) => {
    const colors = {
      defi: '#00FFCC',
      nft: '#FF6496', 
      transfer: '#64C8FF',
      contractCall: '#9664FF',
      contractDeploy: '#64FF96',
      other: '#FFC864'
    }
    return colors[category] || '#8B5CF6'
  }
  
  // Create optimized HTML/Image raindrop element
  const createRainDrop = (category) => {
    const container = containerRef.current
    if (!container) return
    
    const dropId = `drop-${Date.now()}-${Math.random()}`
    const color = getColorForCategory(category)
    const imageSrc = getImageForCategory(category)
    const x = Math.random() * (window.innerWidth - 100) + 50
    const size = 32 + Math.random() * 16 // 32-48px for consistent sizing
    const duration = 3.5 + Math.random() * 1.0 // 3.5-4.5 seconds for consistent speed
    
    // Create optimized image element for raindrop
    const dropElement = document.createElement('img')
    dropElement.id = dropId
    dropElement.className = 'html-raindrop-image-optimized'
    dropElement.src = imageSrc
    dropElement.alt = `${category} transaction`
    dropElement.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: -60px;
      width: ${size}px;
      height: ${size}px;
      object-fit: contain;
      filter: drop-shadow(0 0 12px ${color}88) brightness(1.05);
      animation: rainFallOptimized ${duration}s linear forwards;
      z-index: 5;
      pointer-events: none;
      will-change: transform;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    `
    
    container.appendChild(dropElement)
    
    // Optimized cleanup - remove element exactly when animation ends
    setTimeout(() => {
      if (dropElement && dropElement.parentNode) {
        dropElement.parentNode.removeChild(dropElement)
      }
    }, duration * 1000 + 100) // Reduced cleanup delay for better performance
    
    logger.log(`🌧️ IMAGE DROP: Created ${category} image raindrop at x:${x}`)
    
    return {
      id: dropId,
      element: dropElement,
      category,
      color,
      x,
      size,
      created: Date.now()
    }
  }
  
  // Optimized raindrop creation - smooth and performance-friendly
  useEffect(() => {
    const interval = setInterval(() => {
      const categories = ['defi', 'nft', 'transfer', 'contractCall', 'contractDeploy', 'other']
      const category = categories[Math.floor(Math.random() * categories.length)]
      
      const newDrop = createRainDrop(category)
      if (newDrop) {
        setRainDrops(prev => [...prev, newDrop].slice(-12)) // Keep fewer drops for better performance
        setDropCounter(prev => prev + 1)
      }
    }, 2500) // Slightly faster but still elegant
    
    return () => clearInterval(interval)
  }, [])
  
  // Create raindrops from transactions
  useEffect(() => {
    if (transactions.length === 0) return
    
    const latestTx = transactions[0]
    if (!latestTx) return
    
    // Create raindrop for every transaction
    const newDrop = createRainDrop(latestTx.category)
    if (newDrop) {
      setRainDrops(prev => [...prev, newDrop].slice(-20))
      setDropCounter(prev => prev + 1)
      logger.log(`🌧️ TRANSACTION IMAGE DROP: ${latestTx.category}`)
    }
  }, [transactions])
  
  return (
    <div className="purple-rain-canvas">
      {/* Background with CSS */}
      <div className="css-background">
        <div className="gradient-bg"></div>
        <div className="stars-bg"></div>
      </div>
      
      {/* Raindrop container */}
      <div 
        ref={containerRef} 
        className="raindrops-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}

export default PurpleRainCanvas 