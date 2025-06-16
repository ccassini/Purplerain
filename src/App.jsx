import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PurpleRainCanvas from './components/PurpleRainCanvas'
import Header from './components/Header'
import Stats from './components/Stats'
import Footer from './components/Footer'
import { MonadProvider } from './contexts/MonadContext'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-content"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="purple-rain-logo"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <img 
              src="/monad_logo.png" 
              alt="Monad Logo" 
              className="loading-logo-image"
            />
          </motion.div>
          <h1 className="neon-glow">Purple Rain</h1>
          <p>Monad Blockchain Visualization</p>
          <motion.div
            className="loading-bar"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <MonadProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <PurpleRainCanvas />
          <Stats />
        </main>
        <Footer />
      </div>
    </MonadProvider>
  )
}

export default App 