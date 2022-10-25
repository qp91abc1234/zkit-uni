<template>
  <canvas class="lottie-canvas" id="lottie-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCanvas } from '@lib/common/utils/useCanvas'
// #ifdef H5
import lottieWeb from 'lottie-web'
// #endif
// #ifdef MP_WEIXIN
import lottieWx from 'lottie-miniprogram'
// #endif

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
  (event: 'init', val: any): void
}>()

const inst = getCurrentInstance()
const canvas = useCanvas()
const anim = ref<any>({})

onMounted(() => {
  // #ifdef H5
  initH5()
  // #endif
  // #ifdef MP_WEIXIN
  initWx()
  // #endif
  emits('init', anim.value)
})

onBeforeUnmount(() => {
  canvas.destroy()
  anim.value.destroy()
})

async function initH5() {
  anim.value = lottieWeb.loadAnimation({})
}

async function initWx() {
  const ret: any = await canvas.setup('lottie-canvas', inst)
  lottieWx.setup(ret.canvas)
  anim.value = lottieWx.loadAnimation({
    renderer: 'canvas',
    loop: props.loop,
    autoplay: props.autoplay,
    rendererSettings: {
      context: ret.ctx
    },
    path: props.path
  })
}
</script>

<style lang="scss" scoped>
.lottie-canvas {
  width: 100%;
  height: 100%;
}
</style>
