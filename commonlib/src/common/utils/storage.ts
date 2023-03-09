export default {
  setStorageSync(key: string, data: any) {
    uni.setStorageSync(key, data)
  },

  getStorageSync(key: string) {
    let data: any = ''
    data = uni.getStorageSync(key)
    return data
  },

  clearStorageSync(key?: string) {
    const cacheKey: string[] = []
    const cache = {}
    if (cacheKey) {
      for (let i = 0; i < cacheKey.length; i++) {
        cache[cacheKey[i]] = this.getStorageSync(cacheKey[i])
      }
    }

    if (key) {
      uni.removeStorageSync(key)
    } else {
      uni.clearStorageSync()
    }

    if (cacheKey) {
      for (let i = 0; i < cacheKey?.length; i++) {
        this.setStorageSync(cacheKey[i], cache[cacheKey[i]])
      }
    }
  }
}
