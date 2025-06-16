/**
 * Logger utility for controlling console output
 * Only shows logs in development mode
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args)
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args)
    }
  }
}

// For production, we might want to keep critical errors
export const criticalLogger = {
  error: (...args) => {
    console.error(...args)
  }
} 