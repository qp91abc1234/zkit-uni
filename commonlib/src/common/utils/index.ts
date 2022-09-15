/**
 * 是否json字符串
 */
export function isJsonStr(value) {
  if (typeof value === 'string') {
    try {
      const obj = JSON.parse(value)
      if (typeof obj === 'object') {
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
  return false
}
