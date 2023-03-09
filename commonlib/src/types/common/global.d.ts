import * as utils from '@lib/common/utils/index'
import * as log from '@lib/common/utils/use-log'
import * as audio from '@lib/common/utils/use-audio'
import typeMultiPageList from '@lib/components/multi-page-list/multi-page-list.vue'
import typeWaterfall from '@lib/components/waterfall/waterfall.vue'
import typeLazyload from '@lib/components/lazyload/lazyload.vue'
import typeRender from '@lib/components/render/render.vue'

declare global {
  interface ZKit {
    utils: typeof utils
    log: ReturnType<typeof log.useLog>
    music: ReturnType<typeof audio.useMusic>
    effect: ReturnType<typeof audio.useEffect>
  }
  const zkit: ZKit
}

declare module 'vue' {
  interface GlobalComponents {
    MultiPageList: typeof typeMultiPageList
    Waterfall: typeof typeWaterfall
    Lazyload: typeof typeLazyload
    Render: typeof typeRender
  }
}
