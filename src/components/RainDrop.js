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
    this.maxTrailLength = 15
    this.color = transaction.color || '#8B5CF6'
    this.birth = Date.now()
    this.life = 0
    this.glowIntensity = this.calculateGlow(transaction)
    this.imageManager = imageManager
    this.rotation = 0
    this.rotationSpeed = (Math.random() - 0.5) * 0.02
    this.pulsePhase = Math.random() * Math.PI * 2
    this.isSpecial = this.checkIfSpecial(transaction)
    this.category = transaction.category || 'other'
    
    // Physics properties
    this.velocity = { x: 0, y: this.speed }
    this.acceleration = { x: 0, y: 0.01 }
    this.wind = (Math.random() - 0.5) * 0.3
    
    // Visual effects
    this.sparkles = []
    this.generateSparkles()
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
    // Glow intensity based on transaction importance
    const baseGlow = 10
    const valueGlow = transaction.value * 5
    const gasGlow = transaction.gasPrice * 2
    return Math.min(baseGlow + valueGlow + gasGlow, 50)
  }

  checkIfSpecial(transaction) {
    // Special transactions (high value, contract creation, etc.)
    return transaction.value > 1 || 
           transaction.gasPrice > 100 || 
           (transaction.input && transaction.input !== '0x')
  }

  generateSparkles() {
    if (this.isSpecial) {
      const sparkleCount = Math.floor(Math.random() * 3) + 2
      for (let i = 0; i < sparkleCount; i++) {
        this.sparkles.push({
          x: (Math.random() - 0.5) * this.size * 2,
          y: (Math.random() - 0.5) * this.size * 2,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          phase: Math.random() * Math.PI * 2
        })
      }
    }
  }

  update(p5, deltaTime = 1) {
    // Update physics
    this.velocity.x += this.acceleration.x + this.wind * 0.1
    this.velocity.y += this.acceleration.y
    
    this.x += this.velocity.x * deltaTime
    this.y += this.velocity.y * deltaTime
    
    // Update life and opacity
    this.life = (Date.now() - this.birth) / 1000
    this.opacity = Math.max(0, 1 - this.life / 12) // Fade over 12 seconds
    
    // Update rotation
    this.rotation += this.rotationSpeed * deltaTime
    
    // Update trail
    this.trail.push({ x: this.x, y: this.y, opacity: this.opacity })
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift()
    }
    
    // Update sparkles
    this.updateSparkles(deltaTime)
    
    // Add slight horizontal drift for organic movement
    this.x += Math.sin(this.y * 0.01 + this.pulsePhase) * 0.3 * deltaTime
  }

  updateSparkles(deltaTime) {
    this.sparkles.forEach(sparkle => {
      sparkle.phase += 0.1 * deltaTime
      sparkle.opacity = (Math.sin(sparkle.phase) + 1) * 0.4 * this.opacity
    })
  }

  draw(p5) {
    if (this.opacity <= 0) return

    p5.push()
    p5.translate(this.x, this.y)
    p5.rotate(this.rotation)

    // Draw trail
    this.drawTrail(p5)
    
    // Draw main drop using image manager
    if (this.imageManager) {
      this.drawManagedImage(p5)
    } else {
      this.drawDefaultDrop(p5)
    }
    
    // Draw sparkles for special transactions
    this.drawSparkles(p5)
    
    // Draw glow effect
    this.drawGlow(p5)
    
    p5.pop()
  }

  drawTrail(p5) {
    for (let i = 0; i < this.trail.length; i++) {
      const trailPoint = this.trail[i]
      const trailOpacity = (i / this.trail.length) * trailPoint.opacity * 0.4
      
      if (trailOpacity > 0.01) {
        p5.push()
        const trailColor = p5.color(this.color)
        trailColor.setAlpha(trailOpacity * 255)
        p5.fill(trailColor)
        p5.noStroke()
        
        const trailSize = this.size * (i / this.trail.length) * 0.7
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
    
    // Draw category-specific image with optimized rendering
    p5.push()
    
    // Apply opacity
    p5.tint(255, this.opacity * 255)
    
    // Apply category color tinting
    const tintColor = p5.color(this.color)
    tintColor.setAlpha(this.opacity * 180)
    p5.tint(tintColor)
    
    // Calculate size with performance optimization
    const imageSize = this.size * 2.2
    
    // Draw with optimized parameters
    p5.image(imageToUse, -imageSize/2, -imageSize/2, imageSize, imageSize)
    
    p5.pop()
  }

  drawDefaultDrop(p5) {
    // Enhanced default raindrop with gradient effect
    p5.push()
    
    // Main drop with gradient
    for (let r = this.size * 2; r > 0; r -= 0.5) {
      const alpha = (1 - r / (this.size * 2)) * this.opacity * 0.8
      const dropColor = p5.color(this.color)
      dropColor.setAlpha(alpha * 255)
      p5.fill(dropColor)
      p5.noStroke()
      p5.circle(0, 0, r)
    }
    
    // Inner shine effect
    const shineColor = p5.color('#FFFFFF')
    shineColor.setAlpha(this.opacity * 120)
    p5.fill(shineColor)
    p5.circle(-this.size * 0.3, -this.size * 0.3, this.size * 0.6)
    
    // Pulse effect for special transactions
    if (this.isSpecial) {
      const pulseSize = this.size * (1 + Math.sin(this.life * 8) * 0.2)
      const pulseColor = p5.color(this.color)
      pulseColor.setAlpha(this.opacity * 50)
      p5.fill(pulseColor)
      p5.circle(0, 0, pulseSize * 2.5)
    }
    
    p5.pop()
  }

  drawSparkles(p5) {
    if (!this.isSpecial || this.sparkles.length === 0) return
    
    p5.push()
    this.sparkles.forEach(sparkle => {
      if (sparkle.opacity > 0.01) {
        p5.push()
        p5.translate(sparkle.x, sparkle.y)
        
        const sparkleColor = p5.color('#FFFFFF')
        sparkleColor.setAlpha(sparkle.opacity * 255)
        p5.fill(sparkleColor)
        p5.noStroke()
        
        // Draw star-like sparkle
        p5.rotate(sparkle.phase)
        for (let i = 0; i < 4; i++) {
          p5.rotate(p5.PI / 2)
          p5.ellipse(0, 0, sparkle.size, sparkle.size * 0.3)
        }
        
        p5.pop()
      }
    })
    p5.pop()
  }

  drawGlow(p5) {
    // Outer glow effect
    p5.push()
    p5.drawingContext.shadowColor = this.color
    p5.drawingContext.shadowBlur = this.glowIntensity * this.opacity
    
    const glowColor = p5.color(this.color)
    glowColor.setAlpha(this.opacity * 30)
    p5.fill(glowColor)
    p5.noStroke()
    p5.circle(0, 0, this.size * 3)
    
    p5.pop()
  }

  isOffScreen(height, width) {
    return this.y > height + 100 || 
           this.x < -100 || 
           this.x > width + 100 || 
           this.opacity <= 0.01
  }

  // Get transaction info for display
  getTransactionInfo() {
    return {
      hash: this.tx.hash,
      value: this.tx.value,
      token: this.tx.token || 'MON',
      gasPrice: this.tx.gasPrice,
      from: this.tx.from,
      to: this.tx.to,
      isSpecial: this.isSpecial
    }
  }
} 