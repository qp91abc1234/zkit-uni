<template>
  <canvas class="anim-canvas" id="anim-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useCanvas } from '@lib/common/utils/useCanvas'

const props = withDefaults(
  defineProps<{
    frameNum?: number
  }>(),
  {
    frameNum: 20
  }
)

const emits = defineEmits<{
  (event: 'init', val: { preloadRes: typeof canvas.preloadRes }): void
  (
    event: 'render',
    val: { drawImg: typeof canvas.drawImg; drawAnim: typeof canvas.drawAnim }
  ): void
}>()

const inst = getCurrentInstance()
const canvas = useCanvas()

onLoad(async () => {
  await canvas.setup('anim-canvas', inst)
  emits('init', { preloadRes: canvas.preloadRes })
  canvas.render(() => {
    emits('render', { drawImg: canvas.drawImg, drawAnim: canvas.drawAnim })
  }, props.frameNum)
})

onUnload(() => {
  canvas.destroy()
})
</script>

<style lang="scss" scoped>
.anim-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
