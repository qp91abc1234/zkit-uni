import * as utils from '@lib/common/utils'
import * as log from '@lib/common/utils/useLog'
import * as audio from '@lib/common/utils/useAudio'

const defineGlobalAttr = (key, value) => {
  Object.defineProperty(uni, key, {
    value,
    configurable: false,
    enumerable: false
  })
}

export const setupGlobal = () => {
  defineGlobalAttr('utils', utils)
  defineGlobalAttr('log', log.useLog())
  defineGlobalAttr('music', audio.useMusic())
  defineGlobalAttr('effect', audio.useEffect())
}
