import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { useMonad } from '../contexts/MonadContext'
import './PurpleRainCanvas.css'

// Image cache to prevent repeated requests
const imageCache = new Map()
const imageLoadPromises = new Map()

const PurpleRainCanvas = () => {
  const { transactions, stats, isConnected, connectionStatus } = useMonad()
  const containerRef = useRef(null)
  const dropCounterRef = useRef(0)
  const activeDropsRef = useRef(new Set())
  const imagesPreloadedRef = useRef(false)
  
  // Güncel değerleri ref'te tut - state güncellemelerini azalt
  const statsRef = useRef(stats)
  const isConnectedRef = useRef(isConnected)
  const connectionStatusRef = useRef(connectionStatus)
  
  // Ref'leri güncelle - performans için useMemo ile cache
  const updateRefs = useCallback(() => {
    statsRef.current = stats
    isConnectedRef.current = isConnected
    connectionStatusRef.current = connectionStatus
  }, [stats, isConnected, connectionStatus])
  
  useEffect(() => {
    updateRefs()
  }, [updateRefs])
  
  // Memoized category mappings - gereksiz hesaplamaları önle
  const categoryImages = useMemo(() => ({
    defi: '/drops/defi.png',
    nft: '/drops/nft.png', 
    transfer: '/drops/transfer.png',
    contractCall: '/drops/contract-call.png',
    contractDeploy: '/drops/contract-deploy.png',
    other: '/drops/other.png'
  }), [])
  
  const categoryColors = useMemo(() => ({
    defi: '#00FFCC',
    nft: '#FF6496', 
    transfer: '#64C8FF',
    contractCall: '#9664FF',
    contractDeploy: '#64FF96',
    other: '#FFC864'
  }), [])
  
  // Preload images for caching
  const preloadImage = useCallback((src) => {
    if (imageCache.has(src)) {
      return Promise.resolve(imageCache.get(src))
    }
    
    if (imageLoadPromises.has(src)) {
      return imageLoadPromises.get(src)
    }
    
    const promise = new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        imageCache.set(src, img)
        resolve(img)
      }
      img.onerror = () => {
        // Fallback to original src
        resolve(null)
      }
      img.src = src
    })
    
    imageLoadPromises.set(src, promise)
    return promise
  }, [])
  
  // Preload all category images on mount
  useEffect(() => {
    if (!imagesPreloadedRef.current) {
      const preloadPromises = Object.values(categoryImages).map(preloadImage)
      Promise.all(preloadPromises).then(() => {
        imagesPreloadedRef.current = true
      })
    }
  }, [categoryImages, preloadImage])
  
  const getImageForCategory = useCallback((category) => {
    return categoryImages[category] || categoryImages.other
  }, [categoryImages])
  
  const getColorForCategory = useCallback((category) => {
    return categoryColors[category] || '#8B5CF6'
  }, [categoryColors])
  
  // Ultra optimized raindrop creation - minimum DOM manipulation + cached images
  const createOptimizedRainDrop = useCallback((category) => {
    const container = containerRef.current
    if (!container) return null
    
    const dropId = `drop-${dropCounterRef.current++}`
    const color = getColorForCategory(category)
    const imageSrc = getImageForCategory(category)
    
    // İşlem tipine göre damla özellikleri
    const categoryStats = statsRef.current.categoryStats || {}
    const totalCategoryTx = Object.values(categoryStats).reduce((sum, count) => sum + count, 0)
    const categoryCount = categoryStats[category] || 0
    const categoryPercentage = totalCategoryTx > 0 ? (categoryCount / totalCategoryTx) : 0
    
    // Popüler kategoriler için daha büyük damla boyutu
    const baseSize = 12
    let sizeMultiplier = 1
    if (categoryPercentage > 0.3) {
      sizeMultiplier = 1.4 // %30'dan fazla ise %40 daha büyük
    } else if (categoryPercentage > 0.2) {
      sizeMultiplier = 1.2 // %20'den fazla ise %20 daha büyük
    }
    
    // İşlem tipine göre özel özellikler
    const categoryProperties = {
      defi: { speedMultiplier: 0.9, glowIntensity: 4, sizeBonus: 2 },
      nft: { speedMultiplier: 1.1, glowIntensity: 3, sizeBonus: 1 },
      transfer: { speedMultiplier: 1.0, glowIntensity: 2, sizeBonus: 0 },
      contractCall: { speedMultiplier: 0.8, glowIntensity: 3, sizeBonus: 1 },
      contractDeploy: { speedMultiplier: 0.7, glowIntensity: 5, sizeBonus: 3 },
      other: { speedMultiplier: 1.0, glowIntensity: 2, sizeBonus: 0 }
    }
    
    const props = categoryProperties[category] || categoryProperties.other
    
    // Pre-calculate values to avoid repeated calculations
    const screenWidth = window.innerWidth
    const x = Math.random() * (screenWidth + 100) - 50
    const startY = -100 - Math.random() * 50
    const size = Math.max(8, (baseSize + props.sizeBonus) * sizeMultiplier + Math.random() * 4)
    const baseDuration = 3.0
    const duration = baseDuration / props.speedMultiplier + Math.random() * 0.5
    
    // Create optimized element with cached image
    const dropElement = document.createElement('img')
    
    // Use cached image if available
    const cachedImage = imageCache.get(imageSrc)
    if (cachedImage) {
      dropElement.src = cachedImage.src
    } else {
      dropElement.src = imageSrc
    }
    
    dropElement.className = 'html-raindrop-optimized'
    dropElement.loading = 'eager' // Force immediate loading
    dropElement.decoding = 'sync' // Synchronous decoding for performance
    
    // Enhanced glow effect for popular categories
    const glowSize = props.glowIntensity * (1 + categoryPercentage * 2)
    const glowOpacity = Math.min(0.8, 0.2 + categoryPercentage)
    
    // Single CSS assignment for better performance
    dropElement.style.cssText = `
      position:absolute;left:${x}px;top:${startY}px;width:${size}px;height:${size}px;
      filter:drop-shadow(0 0 ${glowSize}px ${color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')});
      animation:rainFallUltra ${duration}s linear forwards;
      will-change:transform;transform:translate3d(0,0,0);contain:layout style paint;
    `
    
    container.appendChild(dropElement)
    activeDropsRef.current.add(dropId)
    
    // Optimized cleanup with precise timing
    setTimeout(() => {
      if (dropElement.parentNode) {
        dropElement.parentNode.removeChild(dropElement)
        activeDropsRef.current.delete(dropId)
      }
    }, duration * 1000)
    
    return { id: dropId, category }
  }, [getImageForCategory, getColorForCategory])
  
  // Optimized batch raindrop creation
  const createRaindropBatch = useCallback(() => {
    // Only create raindrops if images are preloaded
    if (!imagesPreloadedRef.current) return
    
    // Reduced base drops for better performance
    const baseDrops = 30 // Reduced from 60
    
    const currentStats = statsRef.current
    const currentConnected = isConnectedRef.current
    const currentStatus = connectionStatusRef.current
    
    let bonusDrops = 0
    if (currentConnected && currentStatus === 'connected') {
      const realTps = currentStats.blockTransactions || 0
      // More conservative bonus system
      if (realTps > baseDrops) {
        bonusDrops = Math.min(realTps - baseDrops, 100) // Max 130 total (much more conservative)
      }
    }
    
    const totalDrops = baseDrops + bonusDrops
    
    // İşlem tiplerini istatistiklere göre belirle
    const categoryStats = currentStats.categoryStats || {}
    const totalCategoryTx = Object.values(categoryStats).reduce((sum, count) => sum + count, 0)
    
    // Eğer gerçek istatistik yoksa varsayılan dağılım kullan
    let categoryDistribution
    if (totalCategoryTx > 0) {
      // Gerçek istatistiklere göre dağılım hesapla
      categoryDistribution = {
        defi: Math.round((categoryStats.defi / totalCategoryTx) * 100),
        nft: Math.round((categoryStats.nft / totalCategoryTx) * 100),
        transfer: Math.round((categoryStats.transfer / totalCategoryTx) * 100),
        contractCall: Math.round((categoryStats.contractCall / totalCategoryTx) * 100),
        contractDeploy: Math.round((categoryStats.contractDeploy / totalCategoryTx) * 100),
        other: Math.round((categoryStats.other / totalCategoryTx) * 100)
      }
    } else {
      // Varsayılan gerçekçi dağılım (transfer en çok, contract deploy en az)
      categoryDistribution = {
        transfer: 40,      // En yaygın işlem tipi
        defi: 25,          // DeFi işlemleri
        contractCall: 15,  // Contract çağrıları
        nft: 10,           // NFT işlemleri
        other: 7,          // Diğer işlemler
        contractDeploy: 3  // En nadir işlem tipi
      }
    }
    
    // Kategori dizisini dağılım yüzdelerine göre oluştur
    const weightedCategories = []
    Object.entries(categoryDistribution).forEach(([category, percentage]) => {
      const count = Math.max(1, Math.round((percentage / 100) * totalDrops))
      for (let i = 0; i < count; i++) {
        weightedCategories.push(category)
      }
    })
    
    // Eğer hiç kategori yoksa varsayılan ekle
    if (weightedCategories.length === 0) {
      weightedCategories.push('transfer', 'defi', 'other')
    }
    
    // Batch creation for better performance
    const batchSize = 5
    const batches = Math.ceil(totalDrops / batchSize)
    
    for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
      setTimeout(() => {
        const startIndex = batchIndex * batchSize
        const endIndex = Math.min(startIndex + batchSize, totalDrops)
        
        for (let i = startIndex; i < endIndex; i++) {
          // Ağırlıklı kategorilerden rastgele seç
          const randomIndex = Math.floor(Math.random() * weightedCategories.length)
          const category = weightedCategories[randomIndex]
          
          createOptimizedRainDrop(category)
        }
      }, batchIndex * 100) // Smaller intervals for smoother distribution
    }
  }, [createOptimizedRainDrop])
  
  // Main raindrop generation effect
  useEffect(() => {
    // İşlem yoğunluğuna göre interval ayarla
    const getIntervalBasedOnActivity = () => {
      const currentStats = statsRef.current
      const totalCategoryTx = Object.values(currentStats.categoryStats || {}).reduce((sum, count) => sum + count, 0)
      const recentTps = currentStats.blockTransactions || 0
      
      // Yüksek aktivite varsa daha sık yağmur oluştur
      if (recentTps > 50 || totalCategoryTx > 100) {
        return 600 // Her 600ms'de bir (çok aktif)
      } else if (recentTps > 20 || totalCategoryTx > 50) {
        return 800 // Her 800ms'de bir (aktif)
      } else if (recentTps > 5 || totalCategoryTx > 10) {
        return 1000 // Her 1 saniyede bir (normal)
      } else {
        return 1500 // Her 1.5 saniyede bir (düşük aktivite)
      }
    }

    let interval = setInterval(() => {
      createRaindropBatch()
      
      // İnterval'i dinamik olarak güncelle
      const newInterval = getIntervalBasedOnActivity()
      if (interval._repeat !== newInterval) {
        clearInterval(interval)
        interval = setInterval(createRaindropBatch, newInterval)
        interval._repeat = newInterval
      }
    }, getIntervalBasedOnActivity())
    
    return () => clearInterval(interval)
  }, [createRaindropBatch])
  
  // Cleanup orphaned drops periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      if (activeDropsRef.current.size > 500) {
        // Force cleanup if too many drops
        const container = containerRef.current
        if (container) {
          const oldDrops = container.querySelectorAll('.html-raindrop-optimized')
          if (oldDrops.length > 200) {
            // Remove oldest drops
            for (let i = 0; i < Math.min(50, oldDrops.length); i++) {
              oldDrops[i].remove()
            }
          }
        }
        activeDropsRef.current.clear()
      }
    }, 5000) // Every 5 seconds
    
    return () => clearInterval(cleanupInterval)
  }, [])
  
  // Real transaction drops - minimal processing
  useEffect(() => {
    if (!isConnected || connectionStatus !== 'connected' || !transactions.length) return
    if (!imagesPreloadedRef.current) return // Wait for images to preload
    
    const latestTx = transactions[0]
    if (latestTx?.hash) {
      // Gerçek işlem için özel burst efekti
      const createRealTransactionBurst = (category) => {
        // Ana damla
        createOptimizedRainDrop(category)
        
        // Etrafında küçük particle'lar
        setTimeout(() => {
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              createOptimizedRainDrop(category)
            }, i * 100)
          }
        }, 200)
      }
      
      createRealTransactionBurst(latestTx.category)
    }
  }, [transactions, isConnected, connectionStatus, createOptimizedRainDrop])
  
  return (
    <div className="purple-rain-canvas">
      <div className="css-background">
        <div className="gradient-bg"></div>
        <div className="stars-bg"></div>
      </div>
      
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