import Web3 from 'web3'
import { logger } from './logger'

/**
 * Creates a connection to Monad blockchain
 * @param {Object} config - Monad configuration
 * @returns {Object} Web3 instance and utilities
 */
export async function createMonadConnection(config) {
  try {
    const web3 = new Web3(config.rpcUrl)
    
    // Test connection
    const chainId = await web3.eth.getChainId()
    if (chainId !== config.chainId) {
      throw new Error(`Chain ID mismatch. Expected ${config.chainId}, got ${chainId}`)
    }

    const latestBlock = await web3.eth.getBlockNumber()
    logger.log(`Connected to Monad - Latest block: ${latestBlock}`)

    return {
      web3,
      chainId,
      latestBlock,
      config
    }
  } catch (error) {
    logger.error('Failed to connect to Monad:', error)
    throw error
  }
}

/**
 * Gets live transactions from Monad mempool
 * @param {Object} connection - Monad connection
 * @param {Function} callback - Callback for new transactions
 */
export function subscribeToTransactions(connection, callback) {
  const { web3 } = connection
  
  try {
    // Subscribe to pending transactions
    const subscription = web3.eth.subscribe('pendingTransactions', (error, txHash) => {
      if (error) {
        console.error('Transaction subscription error:', error)
        return
      }
      
      // Get transaction details
      web3.eth.getTransaction(txHash)
        .then(tx => {
          if (tx) {
            const formattedTx = formatTransaction(tx)
            callback(formattedTx)
          }
        })
        .catch(err => console.error('Error fetching transaction:', err))
    })

    return subscription
  } catch (error) {
    console.error('Failed to subscribe to transactions:', error)
    return null
  }
}

/**
 * Subscribe to new blocks
 * @param {Object} connection - Monad connection
 * @param {Function} callback - Callback for new blocks
 */
export function subscribeToBlocks(connection, callback) {
  const { web3 } = connection
  
  try {
    const subscription = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
      if (error) {
        console.error('Block subscription error:', error)
        return
      }
      
      const formattedBlock = formatBlock(blockHeader)
      callback(formattedBlock)
    })

    return subscription
  } catch (error) {
    console.error('Failed to subscribe to blocks:', error)
    return null
  }
}

/**
 * Formats transaction data for visualization
 * @param {Object} tx - Raw transaction object
 * @returns {Object} Formatted transaction
 */
function formatTransaction(tx) {
  const value = parseFloat(tx.value) / Math.pow(10, 18) // Convert wei to ETH
  
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: value.toFixed(6),
    gasPrice: parseInt(tx.gasPrice) / Math.pow(10, 9), // Convert to Gwei
    timestamp: Date.now(),
    blockNumber: tx.blockNumber,
    size: Math.max(1, Math.min(5, Math.floor(value) + 1)), // Size based on value
    color: getTransactionColor(value)
  }
}

/**
 * Formats block data
 * @param {Object} block - Raw block object
 * @returns {Object} Formatted block
 */
function formatBlock(block) {
  return {
    number: block.number,
    hash: block.hash,
    timestamp: Date.now(),
    transactionCount: block.transactions ? block.transactions.length : 0,
    gasUsed: block.gasUsed,
    gasLimit: block.gasLimit
  }
}

/**
 * Gets transaction color based on value
 * @param {number} value - Transaction value in ETH
 * @returns {string} Hex color code
 */
function getTransactionColor(value) {
  if (value > 10) return '#6D28D9' // Dark purple for large transactions
  if (value > 1) return '#8B5CF6'  // Primary purple for medium
  if (value > 0.1) return '#A78BFA' // Light purple for small
  return '#C4B5FD' // Lightest purple for micro transactions
}

/**
 * Calculate network statistics
 * @param {Array} transactions - Recent transactions
 * @param {Object} latestBlock - Latest block info
 * @returns {Object} Network stats
 */
export function calculateNetworkStats(transactions, latestBlock) {
  const now = Date.now()
  const lastMinute = transactions.filter(tx => (now - tx.timestamp) < 60000)
  
  return {
    currentTps: Math.round(lastMinute.length / 60),
    totalTransactions: transactions.length,
    avgBlockTime: 1000, // Monad's 1-second block time
    networkHash: latestBlock?.hash || '0x...',
    activeNodes: 200 // Estimated active nodes
  }
}

/**
 * Generate mock Monad transaction for development
 * @returns {Object} Mock transaction
 */
export function generateMockMonadTransaction() {
  const value = Math.random() * 100
  
  return {
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    from: `0x${Math.random().toString(16).substr(2, 40)}`,
    to: `0x${Math.random().toString(16).substr(2, 40)}`,
    value: value.toFixed(6),
    gasPrice: Math.floor(Math.random() * 50) + 10,
    timestamp: Date.now(),
    blockNumber: Math.floor(Math.random() * 1000000),
    size: Math.max(1, Math.min(5, Math.floor(value / 10) + 1)),
    color: getTransactionColor(value)
  }
} 