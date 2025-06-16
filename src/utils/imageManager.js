/**
 * Optimized Image Manager for Purple Rain
 * Handles efficient loading, caching, and management of category images
 */

export class ImageManager {
  constructor() {
    this.images = new Map()
    this.loadingPromises = new Map()
    this.loadedCount = 0
    this.totalImages = 0
    this.onLoadCallback = null
    
    // Image categories with their paths
    this.imageCategories = {
      defi: '/drops/defi.png',
      nft: '/drops/nft.png',
      transfer: '/drops/transfer.png',
      contractCall: '/drops/contract-call.png',
      contractDeploy: '/drops/contract-deploy.png',
      other: '/drops/other.png',
      default: '/raindrop.png'
    }
    
    this.totalImages = Object.keys(this.imageCategories).length
  }

  /**
   * Initialize image loading with P5 instance
   */
  async initialize(p5Instance, onLoadCallback = null) {
    if (!p5Instance) {
      console.warn('P5 instance not provided to ImageManager')
      return
    }

    this.onLoadCallback = onLoadCallback
    this.loadedCount = 0

    // Load all images concurrently
    const loadPromises = Object.entries(this.imageCategories).map(([category, path]) => 
      this.loadImage(p5Instance, category, path)
    )

    try {
      await Promise.allSettled(loadPromises)
      // Image loading complete (log removed for production)
      
      if (this.onLoadCallback) {
        this.onLoadCallback(this.getLoadedImages(), this.getLoadingStats())
      }
          } catch (error) {
        // Error during image loading (log removed for production)
      }
  }

  /**
   * Load a single image with promise-based approach
   */
  loadImage(p5Instance, category, path) {
    // Return existing promise if already loading
    if (this.loadingPromises.has(category)) {
      return this.loadingPromises.get(category)
    }

    const promise = new Promise((resolve, reject) => {
      p5Instance.loadImage(
        path,
        (img) => {
          // Success callback
          this.images.set(category, img)
          this.loadedCount++
          // Image loaded (log removed for production)
          resolve(img)
        },
        (error) => {
          // Error callback
          console.warn(`⚠️ Failed to load ${category} image from ${path}:`, error)
          this.loadedCount++
          resolve(null) // Resolve with null instead of rejecting
        }
      )
    })

    this.loadingPromises.set(category, promise)
    return promise
  }

  /**
   * Get image for specific category with fallback
   */
  getImage(category) {
    // Try to get category-specific image
    if (this.images.has(category)) {
      return this.images.get(category)
    }

    // Fallback to default image
    if (this.images.has('default')) {
      return this.images.get('default')
    }

    // No image available
    return null
  }

  /**
   * Get all loaded images as object
   */
  getLoadedImages() {
    const imageObj = {}
    for (const [category, image] of this.images.entries()) {
      if (image) {
        imageObj[category] = image
      }
    }
    return imageObj
  }

  /**
   * Get loading statistics
   */
  getLoadingStats() {
    return {
      loaded: this.loadedCount,
      total: this.totalImages,
      percentage: Math.round((this.loadedCount / this.totalImages) * 100),
      isComplete: this.loadedCount >= this.totalImages
    }
  }

  /**
   * Check if specific category image is loaded
   */
  isImageLoaded(category) {
    return this.images.has(category) && this.images.get(category) !== null
  }

  /**
   * Get available categories
   */
  getAvailableCategories() {
    return Array.from(this.images.keys()).filter(category => 
      this.images.get(category) !== null
    )
  }

  /**
   * Preload images for better performance
   */
  async preloadImages(p5Instance) {
    const preloadPromises = []
    
    for (const [category, path] of Object.entries(this.imageCategories)) {
      if (!this.images.has(category)) {
        preloadPromises.push(this.loadImage(p5Instance, category, path))
      }
    }

    if (preloadPromises.length > 0) {
      await Promise.allSettled(preloadPromises)
    }
  }

  /**
   * Clear all loaded images (for cleanup)
   */
  clear() {
    this.images.clear()
    this.loadingPromises.clear()
    this.loadedCount = 0
  }

  /**
   * Get memory usage info
   */
  getMemoryInfo() {
    return {
      imagesInMemory: this.images.size,
      loadedImages: Array.from(this.images.keys()).filter(key => 
        this.images.get(key) !== null
      ).length
    }
  }
}

// Singleton instance
let imageManagerInstance = null

export const getImageManager = () => {
  if (!imageManagerInstance) {
    imageManagerInstance = new ImageManager()
  }
  return imageManagerInstance
}

export default ImageManager 