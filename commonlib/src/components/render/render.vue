<template>
  <view class="anim">
    <canvas class="anim-canvas" id="anim-canvas" type="2d"></canvas>
  </view>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useCanvas } from '@lib/common/utils/useCanvas'

const props = withDefaults(
  defineProps<{
    res?: string[]
    frameNum?: number
  }>(),
  {
    res: () => [],
    frameNum: 20
  }
)

const emits = defineEmits<{
  (
    event: 'render',
    val: { drawImg: typeof canvas.drawImg; drawAnim: typeof canvas.drawAnim }
  ): void
}>()

const inst = getCurrentInstance()
const canvas = useCanvas()

onLoad(async () => {
  await canvas.setup('anim-canvas', inst)
  await canvas.preloadRes(props.res)
  canvas.render(() => {
    emits('render', { drawImg: canvas.drawImg, drawAnim: canvas.drawAnim })
  }, props.frameNum)
})

onUnload(() => {
  canvas.destroy()
})
</script>

<style lang="scss" scoped>
.anim {
  position: absolute;
  width: 100%;
  height: 100%;
  .anim-canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
