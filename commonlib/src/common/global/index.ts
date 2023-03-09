import * as utils from '@lib/common/utils/index'
import * as log from '@lib/common/utils/use-log'
import * as audio from '@lib/common/utils/use-audio'

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
