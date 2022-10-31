import * as utils from '@lib/common/utils'

declare global {
  interface Uni {
    utils: typeof utils
  }
}
