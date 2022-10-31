import * as utils from '@lib/common/utils'
import * as audio from '@lib/common/utils/useAudio'

declare global {
  interface Uni {
    utils: typeof utils
    music: ReturnType<typeof audio.useMusic>
    effect: ReturnType<typeof audio.useEffect>
  }
}
