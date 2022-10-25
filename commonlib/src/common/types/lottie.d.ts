import lottie from 'lottie-miniprogram'

export type AnimationEventName =
  | 'enterFrame'
  | 'loopComplete'
  | 'complete'
  | 'segmentStart'
  | 'destroy'
export type ILottieAnim = ReturnType<typeof lottie.loadAnimation>
