/**
 * Enhanced RainDrop Class for Purple Rain
 * Redesigned for beautiful visual spectacle
 */

export class EnhancedRainDrop {
  constructor(x, y, transaction, imageManager, config = {}) {
    // Position and movement
    this.x = x
    this.y = y
    this.startX = x
    this.startY = y
    
    // Transaction data
    this.tx = transaction
    this.category = transaction.category || 'other'
    this.value = parseFloat(transaction.value) || 0
    
    // Image management - simplified
    this.imageManager = imageManager
    this.image = this.imageManager ? this.imageManager.getImage(this.category) : null
    
    // Clean visual properties
    this.size = this.calculateSize()
    this.opacity = 1 // Start visible instead of invisible
    this.rotation = 0 // No rotation for cleaner look
    this.rotationSpeed = 0 // Disabled rotation
    
    // Simple, clean physics
    this.velocity = {
      x: 0, // No horizontal movement for clean vertical fall
      y: this.calculateFallSpeed()
    }
    
    // Minimal visual effects
    this.birth = Date.now()
    this.life = 0
    this.maxLife = 15 // Shorter life for cleaner cycling
    
    // Simplified trail system
    this.trail = []
    this.maxTrailLength = 3 // Very short trail for clean look
    
    // Minimal special effects - only for very special transactions
    this.isSpecial = this.value > 1.0 // Only high-value transactions
    this.sparkles = [] // Disabled sparkles for cleaner look
    
    // Clean animation properties
    this.scale = 1 // Fixed scale
    this.targetScale = 1
    this.scaleSpeed = 0
    
    // Clean color system - less intense
    this.tintColor = this.getCategoryTint()
    this.tintIntensity = 0.3 // Much more subtle
    this.glowColor = this.getGlowColor()
    
    // Minimal physics effects
    this.windPhase = 0
    this.windStrength = 0 // No wind for clean vertical fall
  }

  calculateSize() {
    // Clean, consistent sizes based on category
    const baseSizes = {
      defi: 25,
      nft: 30,
      contractCall: 20,
      contractDeploy: 35,
      transfer: 18,
      other: 22
    }
    
    let baseSize = baseSizes[this.category] || 22
    
    // Minimal value-based scaling for very clean look
    if (this.value > 5) baseSize *= 1.3
    else if (this.value > 1) baseSize *= 1.1
    
    return baseSize
  }

  calculateFallSpeed() {
    // More natural and varied speeds for individual drop behavior
    const categorySpeeds = {
      defi: 0.8 + Math.random() * 0.4,      // Slower, more deliberate
      nft: 0.6 + Math.random() * 0.3,       // Gentle floating
      transfer: 1.0 + Math.random() * 0.5,  // Moderate speed
      contractCall: 0.7 + Math.random() * 0.4, // Steady pace
      contractDeploy: 0.5 + Math.random() * 0.3, // Very gentle
      other: 0.8 + Math.random() * 0.4      // Balanced
    }
    
    return categorySpeeds[this.category] || 0.8
  }

  calculateGlow() {
    // Enhanced glow for visual beauty
    const categoryGlow = {
      defi: 15 + Math.random() * 10,
      nft: 20 + Math.random() * 15,
      contractCall: 12 + Math.random() * 8,
      contractDeploy: 25 + Math.random() * 15,
      transfer: 10 + Math.random() * 5,
      other: 8 + Math.random() * 7
    }
    
    return categoryGlow[this.category] || 10
  }

  getCategoryTint() {
    const tints = {
      defi: [0, 255, 200],      // Bright cyan
      nft: [255, 100, 150],     // Hot pink
      transfer: [100, 200, 255], // Sky blue
      contractCall: [150, 100, 255], // Purple
      contractDeploy: [100, 255, 150], // Bright green
      other: [255, 200, 100]     // Golden
    }
    return tints[this.category] || [200, 150, 255]
  }

  getGlowColor() {
    // Slightly different glow color for depth
    const [r, g, b] = this.tintColor
    return [
      Math.min(255, r + 30),
      Math.min(255, g + 30),
      Math.min(255, b + 30)
    ]
  }

  generateSparkles() {
    const sparkleCount = Math.floor(Math.random() * 4) + 2
    const sparkles = []
    
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: (Math.random() - 0.5) * this.size,
        y: (Math.random() - 0.5) * this.size,
        size: Math.random() * 3 + 1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.1 + 0.05,
        opacity: 0,
        color: [255, 255, 255]
      })
    }
    
    return sparkles
  }

  update(p5, deltaTime = 1) {
    // Update life
    this.life = (Date.now() - this.birth) / 1000
    
    // Keep opacity at 1 for now to ensure visibility
    this.opacity = 1
    
    // Clean vertical movement only
    const timeMultiplier = Math.min(deltaTime, 1.5)
    this.y += this.velocity.y * timeMultiplier
    
    // Update trail less frequently for clean look
    if (Math.random() < 0.5) { // 50% chance to add trail point
      this.updateTrail()
    }
    
    // Clean gravity - consistent acceleration
    this.velocity.y += 0.01 * timeMultiplier
    
    // Speed limiting for natural look
    this.velocity.y = Math.min(this.velocity.y, 2.5)
  }

  updateTrail() {
    // Clean trail with better spacing
    const lastTrail = this.trail[this.trail.length - 1]
    const minDistance = 25 // Larger distance for cleaner trail
    
    if (!lastTrail || 
        Math.abs(this.y - lastTrail.y) > minDistance) {
      
      this.trail.push({
        x: this.x,
        y: this.y,
        opacity: this.opacity,
        size: this.size * 0.4, // Smaller trail for minimal look
        time: Date.now(),
        color: [...this.tintColor]
      })
    }
    
    // Keep trail very short for clean look
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift()
    }
    
    // Remove old trail points quickly
    const now = Date.now()
    this.trail = this.trail.filter(point => now - point.time < 800) // 0.8 second max trail life
  }

  updateSparkles(deltaTime) {
    this.sparkles.forEach(sparkle => {
      sparkle.phase += sparkle.speed * deltaTime
      sparkle.opacity = (Math.sin(sparkle.phase) + 1) * 0.4 * this.opacity
      
      // Sparkle movement
      sparkle.x += (Math.random() - 0.5) * 0.1 * deltaTime
      sparkle.y += (Math.random() - 0.5) * 0.1 * deltaTime
    })
  }

  draw(p5) {
    if (this.opacity <= 0.01) return

    // Debug logging
    if (Math.random() < 0.01) { // Log occasionally to avoid spam
              // Debug drawing (removed for production)
    }

    // Draw minimal trail first
    this.drawCleanTrail(p5)
    
    // Draw main raindrop - clean and simple
    p5.push()
    p5.translate(this.x, this.y)
    // No rotation, no scaling
    
    // Draw the main drop - simplified
    this.drawCleanDrop(p5)
    
    p5.pop()
  }

  drawCleanTrail(p5) {
    if (this.trail.length < 2) return
    
    p5.push()
    p5.noFill()
    
    // Very simple, clean trail
    for (let i = 1; i < this.trail.length; i++) {
      const current = this.trail[i]
      const previous = this.trail[i - 1]
      
      const trailOpacity = (i / this.trail.length) * current.opacity * 0.3
      if (trailOpacity > 0.05) {
        const [r, g, b] = current.color
        
        // Single, clean trail line
        p5.stroke(r, g, b, trailOpacity * 255)
        p5.strokeWeight(current.size * 0.2) // Very thin trail
        
        p5.line(
          previous.x, previous.y,
          current.x, current.y
        )
      }
    }
    
    p5.pop()
  }

  drawCleanDrop(p5) {
    // Always render something visible
    const [r, g, b] = this.tintColor
    
    // Simple filled circle - always visible
    p5.fill(r, g, b, this.opacity * 200)
    p5.noStroke()
    p5.circle(0, 0, this.size)
    
    // Subtle inner highlight
    p5.fill(255, 255, 255, this.opacity * 80)
    p5.circle(-this.size * 0.15, -this.size * 0.15, this.size * 0.3)
    
    // Try to use image if available (overlay on top)
    if (this.image && this.image.width > 0) {
      p5.tint(255, this.opacity * 150) // Semi-transparent overlay
      p5.imageMode(p5.CENTER)
      p5.image(this.image, 0, 0, this.size * 0.8, this.size * 0.8)
      p5.noTint()
    }
  }

  isOffScreen(height, width) {
    return this.y > height + 200 || 
           this.x < -200 || 
           this.x > width + 200 || 
           this.opacity <= 0.01
  }

  isClicked(mouseX, mouseY) {
    const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2)
    return distance < this.size / 2
  }

  getTransactionInfo() {
    return {
      hash: this.tx.hash || 'N/A',
      category: this.category,
      categoryDisplay: this.category.toUpperCase().replace(/([A-Z])/g, ' $1').trim(),
      value: this.value.toFixed(6),
      token: 'MON',
      blockNumber: this.tx.blockNumber || 'Pending',
      gasPrice: this.tx.gasPrice || 'N/A',
      isSpecial: this.isSpecial
    }
  }
}

export default EnhancedRainDrop 