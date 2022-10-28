export enum MUSIC_STATUS {
  IDLE,
  PLAY,
  PAUSE,
  STOP
}

const musicContext: UniApp.InnerAudioContext = uni.createInnerAudioContext()
let status: MUSIC_STATUS = MUSIC_STATUS.IDLE
export const useMusic = () => {
  const src = (path: string, loop = true) => {
    musicContext.src = path
    musicContext.loop = loop
  }

  const getStatus = () => {
    return status
  }

  const play = (path?: string, loop?: boolean) => {
    if (path) {
      status = MUSIC_STATUS.PLAY
      src(path, loop)
      musicContext.play()
    }
  }

  const pause = () => {
    status = MUSIC_STATUS.PAUSE
    musicContext.pause()
  }

  const resume = () => {
    status = MUSIC_STATUS.PLAY
    musicContext.play()
  }

  const stop = () => {
    status = MUSIC_STATUS.STOP
    musicContext.stop()
    musicContext.src = ''
  }

  return {
    getStatus,
    play,
    pause,
    resume,
    stop
  }
}

let effectContext: { [name: string]: UniApp.InnerAudioContext } = {}
let isMute = false
export const useEffect = () => {
  const play = (path: string, cb: any = null) => {
    if (isMute) return
    if (!effectContext[path]) {
      effectContext[path] = uni.createInnerAudioContext()
      effectContext[path].src = path
      effectContext[path].onEnded(() => {
        cb && cb()
      })
    }
    effectContext[path].play()
  }

  const stop = () => {
    const keys = Object.keys(effectContext)
    for (let i = 0; i < keys.length; i++) {
      effectContext[keys[i]].stop()
    }
  }

  const mute = (val) => {
    isMute = val
    if (val) {
      stop()
    }
  }

  const destroy = () => {
    const keys = Object.keys(effectContext)
    for (let i = 0; i < keys.length; i++) {
      effectContext[keys[i]].destroy()
    }
    effectContext = {}
  }

  return {
    play,
    stop,
    mute,
    destroy
  }
}
