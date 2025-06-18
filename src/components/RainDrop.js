/**
 * Enhanced RainDrop class for Purple Rain visualization
 * Supports custom images and advanced visual effects
 */

export class RainDrop {
  constructor(x, y, transaction, imageManager = null) {
    this.x = x
    this.y = y
    this.tx = transaction
    this.speed = this.calculateSpeed(transaction)
    this.size = this.calculateSize(transaction)
    this.opacity = 1
    this.trail = []
    this.maxTrailLength = 3 // Ultra minimal trail
    this.color = transaction.color || '#8B5CF6'
    this.birth = Date.now()
    this.life = 0
    this.glowIntensity = 0 // Disabled glow to prevent astigmatism issues
    this.imageManager = imageManager
    this.rotation = 0
    this.rotationSpeed = 0 // Disabled rotation for cleaner look
    this.pulsePhase = 0 // Disabled pulsing
    this.isSpecial = false // Disabled special effects
    this.category = transaction.category || 'other'
    
    // Physics properties
    this.velocity = { x: 0, y: this.speed }
    this.acceleration = { x: 0, y: 0.01 }
    this.wind = 0 // Disabled wind for cleaner vertical movement
    
    // Visual effects - disabled to prevent astigmatism
    this.sparkles = [] // No sparkles
  }

  calculateSpeed(transaction) {
    // Speed based on transaction value and gas price
    const baseSpeed = 2
    const valueMultiplier = Math.min(transaction.value * 0.5, 3)
    const gasPriceMultiplier = Math.min(transaction.gasPrice * 0.1, 2)
    return baseSpeed + valueMultiplier + gasPriceMultiplier
  }

  calculateSize(transaction) {
    // Size based on transaction value and type
    const baseSize = 3
    const valueSize = Math.min(transaction.value * 2, 8)
    const gasSize = Math.min(transaction.gasPrice * 0.2, 3)
    return Math.max(baseSize, baseSize + valueSize + gasSize)
  }

  calculateGlow(transaction) {
    // Glow disabled to prevent astigmatism issues
    return 0
  }

  checkIfSpecial(transaction) {
    // Special effects disabled to prevent astigmatism
    return false
  }

  generateSparkles() {
    // Sparkles disabled to prevent astigmatism issues
    this.sparkles = []
  }

  update(p5, deltaTime = 1) {
    // Update physics - clean vertical movement only
    this.velocity.y += this.acceleration.y
    
    this.x += this.velocity.x * deltaTime
    this.y += this.velocity.y * deltaTime
    
    // Update life and opacity
    this.life = (Date.now() - this.birth) / 1000
    this.opacity = Math.max(0, 1 - this.life / 12) // Fade over 12 seconds
    
    // No rotation updates for cleaner look
    
    // Update trail with minimal frequency
    if (Math.random() < 0.1) { // Ultra minimal trail updates
      this.trail.push({ x: this.x, y: this.y, opacity: this.opacity })
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift()
      }
    }
    
    // No sparkle updates
    
    // Clean vertical movement - no horizontal drift
  }

  updateSparkles(deltaTime) {
    // Sparkles disabled
  }

  draw(p5) {
    if (this.opacity <= 0) return

    p5.push()
    p5.translate(this.x, this.y)
    // No rotation

    // Draw minimal trail
    this.drawTrail(p5)
    
    // Draw main drop using image manager
    if (this.imageManager) {
      this.drawManagedImage(p5)
    } else {
      this.drawDefaultDrop(p5)
    }
    
    // No sparkles or glow effects
    
    p5.pop()
  }

  drawTrail(p5) {
    // Simplified trail without excessive effects
    for (let i = 0; i < this.trail.length; i++) {
      const trailPoint = this.trail[i]
      const trailOpacity = (i / this.trail.length) * trailPoint.opacity * 0.2 // Reduced opacity
      
      if (trailOpacity > 0.02) {
        p5.push()
        const trailColor = p5.color(this.color)
        trailColor.setAlpha(trailOpacity * 255)
        p5.fill(trailColor)
        p5.noStroke()
        
        const trailSize = this.size * (i / this.trail.length) * 0.5 // Smaller trail
        p5.translate(trailPoint.x - this.x, trailPoint.y - this.y)
        p5.circle(0, 0, trailSize)
        p5.pop()
      }
    }
  }

  drawManagedImage(p5) {
    // Get the appropriate image from image manager
    const imageToUse = this.imageManager.getImage(this.category)
    
    if (!imageToUse) {
      // Fallback to default drop if no image available
      this.drawDefaultDrop(p5)
      return
    }
    
    // Draw category-specific image with clean rendering
    p5.push()
    
    // Apply opacity without excessive effects
    p5.tint(255, this.opacity * 255)
    
    // Subtle category color tinting
    const tintColor = p5.color(this.color)
    tintColor.setAlpha(this.opacity * 120) // Reduced tinting
    p5.tint(tintColor)
    
    // Calculate size
    const imageSize = this.size * 2.2
    
    // Draw with clean parameters
    p5.image(imageToUse, -imageSize/2, -imageSize/2, imageSize, imageSize)
    
    p5.pop()
  }

  drawDefaultDrop(p5) {
    // Simple default raindrop without gradient effects
    p5.push()
    
    // Simple solid drop
    const dropColor = p5.color(this.color)
    dropColor.setAlpha(this.opacity * 200)
    p5.fill(dropColor)
    p5.noStroke()
    
    // Simple circle instead of complex gradient
    p5.circle(0, 0, this.size * 2)
    
    p5.pop()
  }

  drawSparkles(p5) {
    // Sparkles disabled to prevent astigmatism issues
  }

  drawGlow(p5) {
    // Glow disabled to prevent astigmatism issues
  }

  isOffScreen(height, width) {
    return this.y > height + 50 || 
           this.x < -50 || 
           this.x > width + 50 ||
           this.opacity <= 0
  }

  getTransactionInfo() {
    return {
      hash: this.tx.hash,
      value: this.tx.value,
      gasPrice: this.tx.gasPrice,
      category: this.category,
      categoryDisplay: this.tx.categoryDisplay
    }
  }
} 