const musicCtx: UniApp.InnerAudioContext = uni.createInnerAudioContext()
const effectCtxObj: { [prop: string]: UniApp.InnerAudioContext } = {}

export const useAudio = () => {
  const playMusic = (path, skip = 0) => {
    musicCtx.src = path
    musicCtx.startTime = Math.floor(skip / 1000)
    musicCtx.play()
  }

  const pauseMusic = () => {
    musicCtx.pause()
  }

  const resumeMusic = () => {
    musicCtx.play()
  }

  const stopMusic = () => {
    musicCtx.stop()
  }

  const playEffect = (path) => {
    effectCtxObj[path] = uni.createInnerAudioContext()
    effectCtxObj[path].src = path
    effectCtxObj[path].play()
    effectCtxObj[path].onStop(() => {
      effectCtxObj[path].destroy()
      delete effectCtxObj[path]
    })
  }

  const pauseAllEffect = () => {
    const keys = Reflect.ownKeys(effectCtxObj) as string[]
    keys.forEach((name) => {
      effectCtxObj[name].pause()
    })
  }

  const resumeAllEffect = () => {
    const keys = Reflect.ownKeys(effectCtxObj) as string[]
    keys.forEach((name) => {
      effectCtxObj[name].play()
    })
  }

  const stopAllEffect = () => {
    const keys = Reflect.ownKeys(effectCtxObj) as string[]
    keys.forEach((name) => {
      effectCtxObj[name].stop()
    })
  }

  return {
    playMusic,
    pauseMusic,
    resumeMusic,
    stopMusic,
    playEffect,
    pauseAllEffect,
    resumeAllEffect,
    stopAllEffect
  }
}
