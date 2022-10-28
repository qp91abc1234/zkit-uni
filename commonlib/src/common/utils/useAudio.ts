enum MUSIC_STATUS {
  PLAY,
  PAUSE,
  STOP
}

const musicContext: UniApp.InnerAudioContext = uni.createInnerAudioContext()
let status: MUSIC_STATUS = MUSIC_STATUS.STOP
let isMusicMute = false
export const useMusic = () => {
  const play = (path: string = '', loop: boolean = true) => {
    if (isMusicMute) return
    if (path) {
      status = MUSIC_STATUS.PLAY
      musicContext.src = path
      musicContext.loop = loop
      musicContext.play()
    }
  }

  const pause = () => {
    status = MUSIC_STATUS.PAUSE
    musicContext.pause()
  }

  const resume = () => {
    if (isMusicMute) return
    status = MUSIC_STATUS.PLAY
    musicContext.play()
  }

  const stop = () => {
    status = MUSIC_STATUS.STOP
    musicContext.stop()
    musicContext.src = ''
  }

  const mute = (val: boolean, path?: string, loop?: boolean) => {
    isMusicMute = val
    if (val) {
      pause()
    } else if (status === MUSIC_STATUS.STOP) {
      play(path, loop)
    } else if (status === MUSIC_STATUS.PAUSE) {
      resume()
    }
  }

  return {
    play,
    pause,
    resume,
    stop,
    mute
  }
}

let effectContext: { [name: string]: UniApp.InnerAudioContext } = {}
let isEffectMute = false
export const useEffect = () => {
  const play = (path: string, cb: any = null) => {
    if (isEffectMute) return
    if (!effectContext[path]) {
      effectContext[path] = uni.createInnerAudioContext()
      effectContext[path].src = path
    }

    if (cb) {
      const cbFunc = () => {
        cb()
        effectContext[path].offEnded(cbFunc)
      }
      effectContext[path].onEnded(cbFunc)
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
    isEffectMute = val
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
