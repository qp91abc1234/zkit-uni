<template>
  <view class="load">
    <image
      v-for="item in resImg"
      :key="item"
      :src="item"
      @error="errored($event, item)"
      @load="loadImg"
    ></image>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onUnload } from '@dcloudio/uni-app'
import { useCanvas } from '@lib/common/utils/useCanvas'

const props = withDefaults(
  defineProps<{
    time?: number
    resImg: string[]
    resCanvas?: string[]
    resAudio?: string[]
  }>(),
  {
    time: 1500,
    resImg: () => [],
    resCanvas: () => [],
    resAudio: () => []
  }
)

const emits = defineEmits<{
  (event: 'progress', val: number): void
  (event: 'end'): void
}>()

const canvas = useCanvas()
let progress = 0
let loadedNum = 0
const loadedTime = new Date().getTime()

const allNum = computed(() => {
  return props.resImg.length + props.resCanvas.length + props.resAudio.length
})

onUnload(() => {
  canvas.destroy()
})

const errored = (event: object, item: string) => {
  console.error('[load][errored]: file load error ', item)
  loadedNum++
  loadedJudge('errored')
}

const loadImg = () => {
  loadedNum++
  loadedJudge('loadImg')
}

const loadCanvas = async () => {
  if (props.resCanvas.length <= 0) return
  await canvas.setup()
  await canvas.preloadRes(props.resCanvas)

  loadedNum += props.resCanvas.length
  loadedJudge('loadCanvas')
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
  await loadAudioCore(props.resAudio)
  loadedNum += props.resAudio.length
  loadedJudge('loadAudio')
}

const updateProgress = () => {
  if (loadedNum === allNum.value && progress === 99) {
    emits('end')
  } else if (progress < 99) {
    emits('progress', ++progress)
    setTimeout(updateProgress, props.time / 100)
  }
}

const loadedJudge = (name) => {
  console.log(`[load.vue][${name}] progress = ${loadedNum}/${allNum.value}`)
  if (loadedNum === allNum.value) {
    console.log(
      `[load.vue][loaded] loadedTime = ${new Date().getTime() - loadedTime}ms`
    )
  }
  if (loadedNum === allNum.value && progress === 99) {
    emits('end')
  }
}

const init = () => {
  loadAudio()
  loadCanvas()
  setTimeout(updateProgress, props.time / 100)
}

init()
</script>

<style lang="scss" scoped>
.load {
  position: absolute;
  width: 0%;
  height: 0%;
}
</style>
