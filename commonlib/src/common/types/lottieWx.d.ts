import lottieMini from 'lottie-miniprogram'

export type AnimationEventName =
  | 'enterFrame'
  | 'loopComplete'
  | 'complete'
  | 'segmentStart'
  | 'destroy'
export type ILottieAnim = ReturnType<typeof lottieMini.loadAnimation>
