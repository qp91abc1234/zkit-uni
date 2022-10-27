<template>
  <!-- #ifdef H5 -->
  <view class="lottie-canvas" id="lottie-canvas"></view>
  <!-- #endif -->
  <!-- #ifdef MP-WEIXIN -->
  <canvas class="lottie-canvas" id="lottie-canvas" type="2d"></canvas>
  <!-- #endif -->
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCanvas } from '@lib/common/utils/useCanvas'
// #ifdef H5
import { CORSPathRewrite } from '@lib/common/utils'
import lottieWeb from 'lottie-web'
// #endif
import lottieWx from 'lottie-miniprogram'

export type AnimationEventName =
  | 'enterFrame'
  | 'loopComplete'
  | 'complete'
  | 'segmentStart'
  | 'destroy'

export type ILottieAnim = ReturnType<typeof lottieWx.loadAnimation>

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

onMounted(async () => {
  // #ifdef H5
  initH5()
  // #endif
  // #ifdef MP_WEIXIN
  await initWx()
  // #endif
  emits('init', anim.value)
})

onBeforeUnmount(() => {
  canvas.destroy()
  anim.value.destroy()
})

function initH5() {
  anim.value = lottieWeb.loadAnimation({
    container: document.getElementById('lottie-canvas') as Element,
    loop: props.loop,
    autoplay: props.autoplay,
    path: CORSPathRewrite(props.path)
  })
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
