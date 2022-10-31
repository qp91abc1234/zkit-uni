import * as utils from '@lib/common/utils'
import * as log from '@lib/common/utils/useLog'
import * as audio from '@lib/common/utils/useAudio'

declare global {
  interface Uni {
    utils: typeof utils
    log: ReturnType<typeof log.useLog>
    music: ReturnType<typeof audio.useMusic>
    effect: ReturnType<typeof audio.useEffect>
  }
}
