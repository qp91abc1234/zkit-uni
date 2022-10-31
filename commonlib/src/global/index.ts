import * as utils from '@lib/common/utils'

export const setupGlobal = () => {
  Object.defineProperty(uni, 'utils', {
    value: utils,
    configurable: false,
    enumerable: false
  })
}
