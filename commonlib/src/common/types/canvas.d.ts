import { useCanvas } from '@lib/common/utils/useCanvas'

declare global {
  namespace ZKit {
    interface ImgData {
      src: string
      x: number
      y: number
      rotate: number
      scale: number
      w: number
      h: number
      alpha: number
      anchor: { x: number; y: number }
    }

    enum CANVAS_LOAD_STATUS {
      UNLOAD,
      LOADING,
      SUCC,
      FAIL
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
