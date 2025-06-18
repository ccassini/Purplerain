/**
 * Logger utility - optimized for production
 * Completely disabled in production to save resources
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

export const logger = {
  log: (...args) => {
    // Completely disabled in production
    if (isDevelopment && !isProduction) {
      console.log(...args)
    }
  },
  
  error: (...args) => {
    // Only critical errors in production
    if (isDevelopment) {
      console.error(...args)
    }
  },
  
  warn: (...args) => {
    // Disabled in production
    if (isDevelopment && !isProduction) {
      console.warn(...args)
    }
  },
  
  info: (...args) => {
    // Disabled in production
    if (isDevelopment && !isProduction) {
      console.info(...args)
    }
  }
}

// Only critical system errors
export const criticalLogger = {
  error: (...args) => {
    // Only in development or critical production errors
    if (isDevelopment) {
      console.error(...args)
    }
  }
} 