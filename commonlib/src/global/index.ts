import * as utils from '@lib/common/utils'
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
  defineGlobalAttr('music', audio.useMusic())
  defineGlobalAttr('effect', audio.useEffect())
}
