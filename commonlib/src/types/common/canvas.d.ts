import { useCanvas, CANVAS_LOAD_STATUS } from '@lib/common/utils/use-canvas'

declare global {
  namespace ZKit {
    interface BaseData {
      x: number
      y: number
      rotate: number
      scale: number
      alpha: number
    }

    interface TextData extends BaseData {
      content: string
      color: string
      font: string
      size: number
    }

    interface ImgData extends BaseData {
      src: string
      w: number
      h: number
      anchor: { x: number; y: number }
    }

    interface CanvasCacheData {
      [key: string]: {
        img: any
        w: number
        h: number
        loaded: CANVAS_LOAD_STATUS
        cb: Function[]
      }
    }

    type Canvas = ReturnType<typeof useCanvas>
  }
}
