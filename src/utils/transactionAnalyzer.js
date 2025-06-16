/**
 * Transaction Analyzer for Purple Rain
 * Analyzes transaction types and categorizes them
 */

// Known contract signatures for different transaction types
const CONTRACT_SIGNATURES = {
  // DeFi Operations
  DEFI: {
    'swap': ['0xa9059cbb', '0x23b872dd', '0x095ea7b3', '0x7ff36ab5', '0x38ed1739'],
    'stake': ['0xa694fc3a', '0x2e1a7d4d', '0x3ccfd60b', '0xb6b55f25'],
    'liquidity': ['0xe8e33700', '0xbaa2abde', '0x4515cef3', '0x02751cec'],
    'lending': ['0x1249c58b', '0xa415bcad', '0x69328dec', '0x573ade81']
  },
  
  // NFT Operations
  NFT: {
    'mint': ['0x40c10f19', '0xa0712d68', '0x6a627842', '0x42842e0e'],
    'transfer': ['0x23b872dd', '0x42842e0e', '0xb88d4fde', '0xa22cb465'],
    'sell': ['0x96b5a755', '0xfb0f3ee1', '0x3593564c', '0xab834bab'],
    'approve': ['0x095ea7b3', '0xa22cb465', '0x40c10f19']
  },
  
  // Contract Operations
  CONTRACT: {
    'deploy': [], // Contract creation transactions
    'call': ['0x'] // Generic contract calls
  }
}

// Token transfer signatures
const TRANSFER_SIGNATURES = ['0xa9059cbb', '0x23b872dd']

export class TransactionAnalyzer {
  constructor() {
    this.stats = {
      defi: 0,
      nft: 0,
      transfer: 0,
      contractCall: 0,
      contractDeploy: 0,
      other: 0
    }
  }

  analyzeTransaction(tx) {
    const txType = this.categorizeTransaction(tx)
    this.stats[txType]++
    
    return {
      ...tx,
      category: txType,
      categoryDisplay: this.getCategoryDisplay(txType),
      dropImage: this.getDropImage(txType),
      color: this.getCategoryColor(txType)
    }
  }

  categorizeTransaction(tx) {
    // Contract deployment (to address is null)
    if (!tx.to || tx.to === '0x0000000000000000000000000000000000000000') {
      return 'contractDeploy'
    }

    // Simple ETH/MON transfer (no input data or just 0x)
    if (!tx.input || tx.input === '0x' || tx.input.length <= 2) {
      return 'transfer'
    }

    const methodSignature = tx.input.substring(0, 10).toLowerCase()

    // Check DeFi operations
    if (this.isDeFiTransaction(methodSignature, tx)) {
      return 'defi'
    }

    // Check NFT operations
    if (this.isNFTTransaction(methodSignature, tx)) {
      return 'nft'
    }

    // Check if it's a contract call
    if (tx.input && tx.input.length > 10) {
      return 'contractCall'
    }

    return 'other'
  }

  isDeFiTransaction(signature, tx) {
    // Check against known DeFi signatures
    for (const category of Object.values(CONTRACT_SIGNATURES.DEFI)) {
      if (category.includes(signature)) {
        return true
      }
    }

    // Additional heuristics for DeFi
    if (tx.value > 0.1 && signature !== '0x') {
      // Large value transfers with contract interaction often DeFi
      return true
    }

    return false
  }

  isNFTTransaction(signature, tx) {
    // Check against known NFT signatures
    for (const category of Object.values(CONTRACT_SIGNATURES.NFT)) {
      if (category.includes(signature)) {
        return true
      }
    }

    // NFT transactions often have specific patterns
    if (signature === '0x42842e0e' || signature === '0x23b872dd') {
      return true
    }

    return false
  }

  getCategoryDisplay(category) {
    const displays = {
      defi: 'DeFi',
      nft: 'NFT',
      transfer: 'Transfer',
      contractCall: 'Contract Call',
      contractDeploy: 'Contract Deploy',
      other: 'Other'
    }
    return displays[category] || 'Unknown'
  }

  getDropImage(category) {
    const images = {
      defi: '/drops/defi.png',
      nft: '/drops/nft.png', 
      transfer: '/drops/transfer.png',
      contractCall: '/drops/contract-call.png',
      contractDeploy: '/drops/contract-deploy.png',
      other: '/drops/other.png'
    }
    return images[category] || '/raindrop.png'
  }

  getCategoryColor(category) {
    const colors = {
      defi: '#00D4AA',      // Teal for DeFi
      nft: '#FF6B6B',       // Red for NFT
      transfer: '#4ECDC4',  // Light blue for transfers
      contractCall: '#45B7D1', // Blue for contract calls
      contractDeploy: '#96CEB4', // Green for deployments
      other: '#FECA57'      // Yellow for others
    }
    return colors[category] || '#8B5CF6'
  }

  getStats() {
    return { ...this.stats }
  }

  getTotalTransactions() {
    return Object.values(this.stats).reduce((sum, count) => sum + count, 0)
  }

  getPercentages() {
    const total = this.getTotalTransactions()
    if (total === 0) return {}

    const percentages = {}
    for (const [category, count] of Object.entries(this.stats)) {
      percentages[category] = Math.round((count / total) * 100)
    }
    return percentages
  }

  getMostActiveCategory() {
    let maxCategory = 'other'
    let maxCount = 0

    for (const [category, count] of Object.entries(this.stats)) {
      if (count > maxCount) {
        maxCount = count
        maxCategory = category
      }
    }

    return { category: maxCategory, count: maxCount }
  }

  reset() {
    this.stats = {
      defi: 0,
      nft: 0,
      transfer: 0,
      contractCall: 0,
      contractDeploy: 0,
      other: 0
    }
  }
}

export default TransactionAnalyzer 