export const useLog = () => {
  const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
  const infoDev = (...args) => {
    import.meta.env.MODE !== 'production' && info(...args)
  }
  const warnDev = (...args) => {
    import.meta.env.MODE !== 'production' && warn(...args)
  }
  const errorDev = (...args) => {
    import.meta.env.MODE !== 'production' && error(...args)
  }
  const info = (...args) => {
    console.log(...args)
    log && log.info(...args)
  }
  const warn = (...args) => {
    console.warn(...args)
    log && log.warn(...args)
  }
  const error = (...args) => {
    console.error(...args)
    log && log.error(...args)
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
    infoDev,
    warnDev,
    errorDev,
    info,
    warn,
    error,
    setFilterMsg,
    addFilterMsg
  }
}
