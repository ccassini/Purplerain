/**
 * Rain Weight Manager for Purple Rain
 * Manages weighted drop generation based on transaction category frequency
 */

export class RainWeightManager {
  constructor() {
    this.categoryWeights = {
      defi: 1,
      nft: 1,
      transfer: 1,
      contractCall: 1,
      contractDeploy: 1,
      other: 1
    }
    
    this.totalTransactions = 0
    this.recentTransactions = []
    this.maxRecentTransactions = 100 // Keep track of last 100 transactions
    this.weightUpdateInterval = 5000 // Update weights every 5 seconds
    this.lastWeightUpdate = Date.now()
  }

  /**
   * Add a new transaction and update weights
   */
  addTransaction(transaction) {
    const category = transaction.category || 'other'
    
    // Add to recent transactions
    this.recentTransactions.push({
      category,
      timestamp: Date.now()
    })
    
    // Keep only recent transactions
    if (this.recentTransactions.length > this.maxRecentTransactions) {
      this.recentTransactions.shift()
    }
    
    this.totalTransactions++
    
    // Update weights if enough time has passed
    if (Date.now() - this.lastWeightUpdate > this.weightUpdateInterval) {
      this.updateWeights()
    }
  }

  /**
   * Update category weights based on recent transaction frequency
   */
  updateWeights() {
    // Count recent transactions by category
    const categoryCounts = {}
    const now = Date.now()
    const timeWindow = 30000 // Last 30 seconds
    
    // Initialize counts
    Object.keys(this.categoryWeights).forEach(category => {
      categoryCounts[category] = 0
    })
    
    // Count recent transactions within time window
    this.recentTransactions
      .filter(tx => now - tx.timestamp < timeWindow)
      .forEach(tx => {
        categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1
      })
    
    // Calculate total recent transactions
    const totalRecent = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
    
    if (totalRecent > 0) {
      // Calculate weights (more frequent = higher weight)
      Object.keys(this.categoryWeights).forEach(category => {
        const frequency = categoryCounts[category] / totalRecent
        // Weight formula: base weight + frequency bonus
        this.categoryWeights[category] = Math.max(0.1, 1 + frequency * 3)
      })
      
      // Updated rain weights (log removed for production)
    }
    
    this.lastWeightUpdate = now
  }

  /**
   * Get weight for a specific category
   */
  getWeight(category) {
    return this.categoryWeights[category] || 1
  }

  /**
   * Get all current weights
   */
  getAllWeights() {
    return { ...this.categoryWeights }
  }

  /**
   * Get the most active category
   */
  getMostActiveCategory() {
    let maxWeight = 0
    let mostActive = 'other'
    
    Object.entries(this.categoryWeights).forEach(([category, weight]) => {
      if (weight > maxWeight) {
        maxWeight = weight
        mostActive = category
      }
    })
    
    return { category: mostActive, weight: maxWeight }
  }

  /**
   * Should generate extra drops for this category?
   */
  shouldGenerateExtraDrop(category) {
    const weight = this.getWeight(category)
    const baseChance = 0.3 // 30% base chance
    const weightedChance = baseChance * weight
    
    return Math.random() < weightedChance
  }

  /**
   * Get number of drops to generate for this transaction
   */
  getDropCount(category) {
    const weight = this.getWeight(category)
    
    // Base: 1 drop per transaction
    // High weight categories get extra drops
    if (weight > 2.5) return 3 // Very active: 3 drops
    if (weight > 1.8) return 2 // Active: 2 drops
    return 1 // Normal: 1 drop
  }

  /**
   * Get statistics for display
   */
  getStats() {
    const mostActive = this.getMostActiveCategory()
    
    return {
      totalTransactions: this.totalTransactions,
      recentTransactions: this.recentTransactions.length,
      mostActiveCategory: mostActive.category,
      mostActiveWeight: mostActive.weight.toFixed(2),
      weights: this.getAllWeights()
    }
  }

  /**
   * Reset all weights and counters
   */
  reset() {
    Object.keys(this.categoryWeights).forEach(category => {
      this.categoryWeights[category] = 1
    })
    this.totalTransactions = 0
    this.recentTransactions = []
    this.lastWeightUpdate = Date.now()
  }
}

// Singleton instance
let rainWeightManagerInstance = null

export const getRainWeightManager = () => {
  if (!rainWeightManagerInstance) {
    rainWeightManagerInstance = new RainWeightManager()
  }
  return rainWeightManagerInstance
}

export default RainWeightManager 