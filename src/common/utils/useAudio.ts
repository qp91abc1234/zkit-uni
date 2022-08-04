let audioContext: WechatMiniprogram.InnerAudioContext | null =
  wx.createInnerAudioContext()

export const useAudio = () => {
  const play = (path, skip = 0) => {
    audioContext = audioContext || wx.createInnerAudioContext()
    audioContext.src = path
    audioContext.startTime = Math.floor(skip / 1000)
    audioContext.play()
  }

  const stop = () => {
    audioContext!.stop()
  }

  const destroy = () => {
    audioContext!.destroy()
    audioContext = null
  }

  return {
    play,
    stop,
    destroy
  }
}
