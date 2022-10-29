const musicContext: UniApp.InnerAudioContext = uni.createInnerAudioContext()
let isMusicMute = false
export const useMusic = () => {
  const play = (path: string = '', loop: boolean = true) => {
    if (isMusicMute) return
    if (path) {
      musicContext.src = path
      musicContext.loop = loop
    }
    musicContext.play()
  }

  const pause = () => {
    musicContext.pause()
  }

  const stop = () => {
    musicContext.stop()
    musicContext.src = ''
  }

  const mute = (val: boolean, path?: string, loop?: boolean) => {
    isMusicMute = val
    if (val) {
      pause()
    } else {
      play(path, loop)
    }
  }

  return {
    play,
    pause,
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
