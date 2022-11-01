import * as utils from '@lib/common/utils'
import * as log from '@lib/common/utils/useLog'
import * as audio from '@lib/common/utils/useAudio'

export const setupGlobal = () => {
  const obj = Object.prototype
  Object.defineProperty(obj, 'zkit', {
    value: {
      utils,
      log: log.useLog(),
      music: audio.useMusic(),
      effect: audio.useEffect()
    },
    configurable: false,
    enumerable: false
  })
}
