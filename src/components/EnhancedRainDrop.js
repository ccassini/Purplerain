/**
 * Enhanced RainDrop Class for Purple Rain
 * Redesigned for clean visual experience without astigmatism triggers
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
    this.opacity = 1 // Start visible
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
    this.maxTrailLength = 1 // Ultra minimal trail
    
    // No special effects to prevent astigmatism
    this.isSpecial = false // Disabled special effects
    this.sparkles = [] // No sparkles
    
    // Clean animation properties
    this.scale = 1 // Fixed scale
    this.targetScale = 1
    this.scaleSpeed = 0
    
    // Clean color system - very subtle
    this.tintColor = this.getCategoryTint()
    this.tintIntensity = 0.1 // Very subtle tinting
    this.glowColor = [0, 0, 0] // No glow
    
    // No physics effects
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
    
    // Minimal value-based scaling for clean look
    if (this.value > 5) baseSize *= 1.2
    else if (this.value > 1) baseSize *= 1.1
    
    return baseSize
  }

  calculateFallSpeed() {
    // Natural and varied speeds for individual drop behavior
    const categorySpeeds = {
      defi: 0.8 + Math.random() * 0.3,      // Slower, more deliberate
      nft: 0.6 + Math.random() * 0.2,       // Gentle floating
      transfer: 1.0 + Math.random() * 0.4,  // Moderate speed
      contractCall: 0.7 + Math.random() * 0.3, // Steady pace
      contractDeploy: 0.5 + Math.random() * 0.2, // Very gentle
      other: 0.8 + Math.random() * 0.3      // Balanced
    }
    
    return categorySpeeds[this.category] || 0.8
  }

  calculateGlow() {
    // No glow to prevent astigmatism
    return 0
  }

  getCategoryTint() {
    // Subtle colors to prevent visual strain
    const tints = {
      defi: [0, 200, 180],      // Soft cyan
      nft: [200, 100, 150],     // Soft pink
      transfer: [100, 180, 200], // Soft blue
      contractCall: [150, 100, 200], // Soft purple
      contractDeploy: [100, 200, 150], // Soft green
      other: [200, 180, 100]     // Soft gold
    }
    return tints[this.category] || [180, 150, 200]
  }

  getGlowColor() {
    // No glow color
    return [0, 0, 0]
  }

  generateSparkles() {
    // No sparkles to prevent astigmatism
    return []
  }

  update(p5, deltaTime = 1) {
    // Update life
    this.life = (Date.now() - this.birth) / 1000
    
    // Maintain opacity for visibility
    this.opacity = Math.max(0, 1 - this.life / this.maxLife)
    
    // Clean vertical movement only
    const timeMultiplier = Math.min(deltaTime, 1.5)
    this.y += this.velocity.y * timeMultiplier
    
    // Update trail very rarely for pure performance
    if (Math.random() < 0.05) { // Ultra rare trail updates
      this.updateTrail()
    }
    
    // Clean gravity - consistent acceleration
    this.velocity.y += 0.01 * timeMultiplier
    
    // Speed limiting for natural look
    this.velocity.y = Math.min(this.velocity.y, 2.5)
  }

  updateTrail() {
    // Minimal trail with better spacing
    const lastTrail = this.trail[this.trail.length - 1]
    const minDistance = 40 // Larger distance for cleaner trail
    
    if (!lastTrail || 
        Math.abs(this.y - lastTrail.y) > minDistance) {
      
      this.trail.push({
        x: this.x,
        y: this.y,
        opacity: this.opacity,
        size: this.size * 0.3, // Smaller trail for minimal look
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
    this.trail = this.trail.filter(point => now - point.time < 600) // 0.6 second max trail life
  }

  updateSparkles(deltaTime) {
    // No sparkles
  }

  draw(p5) {
    if (this.opacity <= 0.01) return

    p5.push()
    p5.translate(this.x, this.y)
    
    // Draw minimal trail
    this.drawCleanTrail(p5)
    
    // Draw clean drop
    this.drawCleanDrop(p5)
    
    p5.pop()
  }

  drawCleanTrail(p5) {
    // Minimal trail without effects
    if (this.trail.length === 0) return
    
    p5.push()
    p5.noStroke()
    
    this.trail.forEach((point, index) => {
      const age = (Date.now() - point.time) / 600 // 0.6 second max
      const trailOpacity = (1 - age) * this.opacity * 0.1 // Very subtle
      
      if (trailOpacity > 0.01) {
        const [r, g, b] = point.color
        const trailColor = p5.color(r, g, b)
        trailColor.setAlpha(trailOpacity * 255)
        p5.fill(trailColor)
        
        const relativeX = point.x - this.x
        const relativeY = point.y - this.y
        const trailSize = point.size * (1 - age) * 0.5
        
        p5.push()
        p5.translate(relativeX, relativeY)
        p5.circle(0, 0, trailSize)
        p5.pop()
      }
    })
    
    p5.pop()
  }

  drawCleanDrop(p5) {
    // Clean drop rendering without effects
    if (!this.image) {
      // Simple colored circle
      p5.push()
      p5.noStroke()
      
      const [r, g, b] = this.tintColor
      const dropColor = p5.color(r, g, b)
      dropColor.setAlpha(this.opacity * 180)
      p5.fill(dropColor)
      
      p5.circle(0, 0, this.size)
      p5.pop()
      return
    }
    
    // Image-based drop with minimal effects
    p5.push()
    
    // Very subtle tinting
    const [r, g, b] = this.tintColor
    const tintColor = p5.color(r, g, b)
    tintColor.setAlpha(this.opacity * 60) // Very subtle
    p5.tint(tintColor)
    
    // Draw image
    p5.image(this.image, -this.size/2, -this.size/2, this.size, this.size)
    
    p5.pop()
  }

  isOffScreen(height, width) {
    return this.y > height + 50 || 
           this.x < -50 || 
           this.x > width + 50 ||
           this.opacity <= 0.01
  }

  isClicked(mouseX, mouseY) {
    const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2)
    return distance < this.size
  }

  getTransactionInfo() {
    return {
      hash: this.tx.hash,
      value: this.tx.value,
      category: this.category,
      categoryDisplay: this.tx.categoryDisplay || this.category
    }
  }
}

export default EnhancedRainDrop 