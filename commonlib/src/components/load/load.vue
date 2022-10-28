<template>
  <view class="load">
    <canvas id="load-canvas" type="2d"></canvas>
    <image
      v-for="item in resImg"
      :key="item"
      :src="item"
      @error="errored(item)"
      @load="loadImg"
    ></image>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted } from 'vue'
import { useCanvas } from '@lib/common/utils/useCanvas'

const props = withDefaults(
  defineProps<{
    time?: number
    maxTime?: number
    resImg: string[]
    resCanvas?: string[]
    resAudio?: string[]
  }>(),
  {
    time: 3000,
    maxTime: 8000,
    resImg: () => [],
    resCanvas: () => [],
    resAudio: () => []
  }
)

const emits = defineEmits<{
  (event: 'progress', val: number): void
  (event: 'end'): void
}>()

const startTime = new Date().getTime()
const inst = getCurrentInstance()
const canvas = useCanvas()
let progress = 0
let loadedNum = 0
let isEnd = false

const allNum = computed(() => {
  return props.resImg.length + props.resCanvas.length + props.resAudio.length
})

onMounted(() => {
  loadCanvas()
})

onBeforeUnmount(() => {
  canvas.destroy()
})

const errored = (item: string) => {
  console.error('[load][errored]: file load error ', item)
  updateRealProgress('errored')
}

const loadImg = () => {
  updateRealProgress('loadImg')
}

const loadCanvas = async () => {
  if (props.resCanvas.length <= 0) return
  try {
    await canvas.setup('load-canvas', inst)
    await canvas.preloadRes(props.resCanvas)
  } catch (err) {
    console.error(`[load.vue][loadCanvas] ${err}`)
  } finally {
    updateRealProgress('loadCanvas', props.resCanvas.length)
  }
}

const loadAudioCore = (path: string[]) => {
  const audioContext: UniApp.InnerAudioContext[] = []
  for (let i = 0; i < path.length; i++) {
    audioContext[i] = uni.createInnerAudioContext()
    audioContext[i].src = path[i]
  }
  return new Promise((resolve) => {
    let index = 0
    for (let i = 0; i < path.length; i++) {
      const cb = () => {
        index++
        if (index === path.length) {
          for (let j = 0; j < path.length; j++) {
            audioContext[j].destroy()
          }
          resolve(true)
        }
      }
      audioContext[i].onCanplay(cb)
      audioContext[i].onError(cb)
    }
  })
}

const loadAudio = async () => {
  try {
    await loadAudioCore(props.resAudio)
  } catch (err) {
    console.error(`[load.vue][loadAudio] ${err}`)
  } finally {
    updateRealProgress('loadAudio', props.resAudio.length)
  }
}

const updateFakeProgress = () => {
  if (loadedNum === allNum.value && progress === 99) {
    loadEnd()
  } else if (progress < 99) {
    emits('progress', ++progress)
    setTimeout(updateFakeProgress, props.time / 100)
  } else if (progress === 99) {
    if (new Date().getTime() - startTime > props.maxTime) {
      loadEnd()
    } else {
      setTimeout(updateFakeProgress, props.time / 100)
    }
  }
}

const updateRealProgress = (name, num = 1) => {
  loadedNum += num
  console.log(`[load.vue][${name}] progress = ${loadedNum}/${allNum.value}`)
  if (loadedNum === allNum.value) {
    console.log(
      `[load.vue][loaded] loadedTime = ${new Date().getTime() - startTime}ms`
    )
  }
  if (loadedNum === allNum.value && progress === 99) {
    loadEnd()
  }
}

const loadEnd = () => {
  if (!isEnd) {
    emits('end')
    isEnd = true
  }
}

loadAudio()
setTimeout(updateFakeProgress, props.time / 100)
</script>

<style lang="scss" scoped>
.load {
  overflow: hidden;
  width: 0;
  height: 0;
}
</style>
