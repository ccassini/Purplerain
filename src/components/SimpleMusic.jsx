import React, { useState, useRef, useEffect } from 'react'
import './SimpleMusic.css'

const SimpleMusic = () => {
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Initialize music on page load
    const audio = audioRef.current
    if (audio) {
      // Preload for caching
      audio.preload = 'auto'
      
      // Set volume level
      audio.volume = 0.3
      
      // Mark as loaded
      setIsLoaded(true)
      
      // Try autoplay without user interaction
      const tryAutoplay = async () => {
        try {
          await audio.play()
          console.log('Music started automatically')
          setIsMuted(false)
        } catch (error) {
          console.log('Autoplay blocked, user interaction required')
          setIsMuted(true) // Mark as not started
        }
      }
      
      // Start music on first interaction
      const handleFirstInteraction = () => {
        if (audio.paused) {
          tryAutoplay()
        }
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
      }
      
      // Add event listeners
      document.addEventListener('click', handleFirstInteraction)
      document.addEventListener('keydown', handleFirstInteraction)
      
      // Try immediately
      setTimeout(tryAutoplay, 100)
      
      // Cleanup
      return () => {
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
      }
    }
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (audio) {
      if (isMuted) {
        // Turn on music - start playing
        audio.volume = 0.3
        audio.play().catch(console.error)
      } else {
        // Turn off music - pause completely
        audio.pause()
      }
      setIsMuted(!isMuted)
    }
  }

  // Start music on first click (browser policy)
  const handleFirstPlay = () => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.3
      audio.play().then(() => {
        console.log('Music started')
        setIsMuted(false)
      }).catch((error) => {
        console.error('Failed to start music:', error)
      })
    }
  }

  return (
    <div className="simple-music">
      <audio
        ref={audioRef}
        src="/music/background-music.mp3"
        loop
        preload="auto"
        onCanPlayThrough={() => setIsLoaded(true)}
      />
      
      <button 
        className={`music-toggle ${isMuted ? 'muted' : 'playing'}`}
        onClick={audioRef.current?.paused ? handleFirstPlay : toggleMute}
        title={audioRef.current?.paused ? "Start Music" : (isMuted ? "Turn On Music" : "Turn Off Music")}
      >
{audioRef.current?.paused ? '💜' : (isMuted ? '🔇' : '🎵')}
      </button>
    </div>
  )
}

export default SimpleMusic 