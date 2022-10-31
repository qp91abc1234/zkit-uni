export const useLog = () => {
  const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
  const info = (...args) => {
    if (!log) return
    console.log(...args)
    log.info(...args)
  }
  const warn = (...args) => {
    if (!log) return
    console.warn(...args)
    log.warn(...args)
  }
  const error = (...args) => {
    if (!log) return
    console.error(...args)
    log.error(...args)
  }
  const setFilterMsg = (msg) => {
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    log.setFilterMsg(msg)
  }
  const addFilterMsg = (msg) => {
    if (!log || !log.addFilterMsg) return
    if (typeof msg !== 'string') return
    log.addFilterMsg(msg)
  }
  return {
    info,
    warn,
    error,
    setFilterMsg,
    addFilterMsg
  }
}
