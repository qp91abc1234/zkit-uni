<template>
  <canvas class="lottie-canvas" id="lottie-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCanvas } from '@lib/common/utils/useCanvas'
import lottie from 'lottie-miniprogram'
import { ILottieAnim } from '@lib/common/types/lottie.d'

const props = withDefaults(
  defineProps<{
    path: string
    loop?: boolean | number
    autoplay?: boolean
  }>(),
  {
    path: '',
    loop: true,
    autoplay: true
  }
)

const emits = defineEmits<{
  (event: 'init', val: ILottieAnim): void
}>()

const inst = getCurrentInstance()
const canvas = useCanvas()
const anim = ref<ILottieAnim>({} as any)

onMounted(async () => {
  const ret: any = await canvas.setup('lottie-canvas', inst)
  lottie.setup(ret.canvas)
  anim.value = lottie.loadAnimation({
    renderer: 'canvas',
    loop: props.loop,
    autoplay: props.autoplay,
    rendererSettings: {
      context: ret.ctx
    },
    path: props.path
  })
  emits('init', anim.value)
})

onBeforeUnmount(() => {
  canvas.destroy()
  anim.value.destroy()
})
</script>

<style lang="scss" scoped>
.lottie-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
