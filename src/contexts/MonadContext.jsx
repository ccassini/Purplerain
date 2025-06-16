import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createMonadConnection } from '../utils/monadUtils'
import MonadWebSocketManager from '../utils/monadWebSocket'
import TransactionAnalyzer from '../utils/transactionAnalyzer'
import { logger } from '../utils/logger'

const MonadContext = createContext()

// Monad Testnet configuration
const MONAD_TESTNET_CONFIG = {
  rpcUrl: 'https://testnet-rpc.monad.xyz',
  wsUrl: 'wss://testnet-rpc.monad.xyz',
  chainId: 41454, // Monad testnet chain ID
  blockTime: 500, // 0.5 second block time
  maxTps: 10000,
  nativeToken: 'MON',
  explorerUrl: 'https://explorer-testnet.monadinfra.com'
}

export const MonadProvider = ({ children }) => {
  const [connection, setConnection] = useState(null)
  const [wsManager, setWsManager] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [latestBlock, setLatestBlock] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [txAnalyzer] = useState(() => new TransactionAnalyzer())
  const [stats, setStats] = useState({
    currentTps: 0,
    totalTransactions: 0,
    blockTransactions: 0,
    gasPrice: 0,
    networkHash: '0x...',
    // Transaction category stats
    categoryStats: {
      defi: 0,
      nft: 0,
      transfer: 0,
      contractCall: 0,
      contractDeploy: 0,
      other: 0
    }
  })
  const [connectionStatus, setConnectionStatus] = useState('connecting')

  // Handle new block from WebSocket
  const handleNewBlock = useCallback((blockData) => {
    setLatestBlock({
      number: blockData.number,
      hash: blockData.hash,
      timestamp: blockData.timestamp,
      transactionCount: blockData.transactionCount,
      gasUsed: blockData.gasUsed,
      gasLimit: blockData.gasLimit,
      networkUtilization: blockData.networkUtilization
    })

    // Update stats with real block data
    setStats(prev => ({
      ...prev,
      blockTransactions: blockData.transactionCount || 0,
      networkHash: blockData.hash ? blockData.hash.substring(0, 16) + '...' : prev.networkHash,
      gasPrice: blockData.baseFeePerGas ? Math.round(blockData.baseFeePerGas / 1e9) : prev.gasPrice
    }))
  }, [])

  // Handle new transaction from WebSocket
  const handleNewTransaction = useCallback((txData) => {
    // Analyze transaction type
    const analyzedTx = txAnalyzer.analyzeTransaction(txData)
    
    setTransactions(prev => {
      const updated = [analyzedTx, ...prev].slice(0, 1000) // Keep last 1000 tx
      return updated
    })

    // Update transaction stats
    setStats(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1,
      currentTps: wsManager ? wsManager.getStats().currentTps : prev.currentTps,
      gasPrice: analyzedTx.gasPrice || prev.gasPrice,
      networkHash: analyzedTx.hash ? analyzedTx.hash.substring(0, 16) + '...' : prev.networkHash,
      categoryStats: txAnalyzer.getStats()
    }))
  }, [wsManager, txAnalyzer])

  // Initialize connection to Monad testnet
  const initConnection = useCallback(async () => {
    try {
      setConnectionStatus('connecting')
      logger.log('🚀 Initializing Monad connection...')
      
      // Try WebSocket connection first
      const ws = new MonadWebSocketManager(MONAD_TESTNET_CONFIG)
      
      // Set up event listeners
      ws.on('newBlock', handleNewBlock)
      ws.on('newTransaction', handleNewTransaction)
      ws.on('connectionFailed', () => {
        logger.log('❌ WebSocket connection failed - no fallback')
        handleConnectionFailure()
      })
      
      await ws.connect()
      setWsManager(ws)
      setIsConnected(true)
      setConnectionStatus('connected')
      logger.log('✅ Connected to Monad Testnet WebSocket')
      
    } catch (error) {
      logger.error('❌ Failed to connect to Monad WebSocket:', error)
      handleConnectionFailure()
    }
  }, [])

  // Sadece gerçek bağlantı başarısız olursa bilgi ver
  const handleConnectionFailure = useCallback(() => {
    logger.log('❌ Real blockchain connection failed. No fallback data.')
    setConnectionStatus('failed')
    setIsConnected(false)
  }, [])

  useEffect(() => {
    initConnection()
    
    // Cleanup function
    return () => {
      if (wsManager) {
        wsManager.disconnect()
      }
    }
  }, [initConnection])

  const testRealConnection = useCallback(() => {
    if (wsManager) {
      wsManager.forceRealDataMode()
    }
  }, [wsManager])

  const value = {
    connection,
    wsManager,
    isConnected,
    connectionStatus,
    latestBlock,
    transactions,
    stats,
    txAnalyzer,
    config: MONAD_TESTNET_CONFIG,
    testRealConnection
  }

  return (
    <MonadContext.Provider value={value}>
      {children}
    </MonadContext.Provider>
  )
}

export const useMonad = () => {
  const context = useContext(MonadContext)
  if (!context) {
    throw new Error('useMonad must be used within a MonadProvider')
  }
  return context
} 