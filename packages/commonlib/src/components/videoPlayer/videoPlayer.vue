<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, getCurrentInstance, watch } from 'vue'
import videojs, { type VideoJsPlayerOptions } from 'video.js'
import 'video.js/dist/video-js.css'
import './videoPlayer.css'

const props = withDefaults(
  defineProps<{
    autoplay?: boolean
    loop?: boolean
    controls?: boolean
    controlBar?: object
    poster?: string
    events?: string[]
    playsinline?: boolean
    crossOrigin?: string
    blurBg?: string
    aspectRatio?: string
    path: string
  }>(),
  {
    autoplay: false,
    loop: true,
    controls: true,
    controlBar: () => {
      return {}
    },
    poster: '',
    events: () => [],
    playsinline: true,
    crossOrigin: '',
    blurBg: '',
    aspectRatio: '',
    path: ''
  }
)

const player = ref<videojs.Player>()
const videoPlayerRef = ref()
const blurBgRef = ref()
const customLayoutRef = ref()
const defaultOpts = {
  fill: true,
  playbackRates: [0.5, 1.0, 1.5, 2.0],
  autoplay: true,
  muted: false,
  loop: false,
  preload: 'auto' as videojs.Preload,
  language: 'zh-CN',
  notSupportedMessage: '此视频暂无法播放，请稍后再试',
  controls: true,
  controlBar: {
    volumePanel: {
      inline: false
    },
    pictureInPictureToggle: false,
    timeDivider: true,
    durationDisplay: true,
    remainingTimeDisplay: false,
    fullscreenToggle: true
  }
}
const defaultEvents = ['canplay', 'play', 'pause', 'ended']
const mergeOpts = ref<VideoJsPlayerOptions>({})
const mergeEvents = ref<Set<string>>()

watch(
  () => {
    return props.poster
  },
  (val) => {
    player.value?.poster(val)
  }
)

watch(
  () => {
    return props.path
  },
  (val) => {
    player.value?.src(val)
  }
)

onMounted(() => {
  const inst = getCurrentInstance()!
  attrDeal()
  player.value = videojs(videoPlayerRef.value, mergeOpts.value, () => {
    aspectRatioDeal()
    customEleDeal()
    eventDeal(inst)
  })
})

onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose()
    player.value = undefined
  }
})

const attrDeal = () => {
  if (props.playsinline) {
    videoPlayerRef.value.setAttribute('playsinline', props.playsinline)
    videoPlayerRef.value.setAttribute('webkit-playsinline', props.playsinline)
    videoPlayerRef.value.setAttribute('x5-playsinline', props.playsinline)
    videoPlayerRef.value.setAttribute('x5-video-player-type', 'h5')
    videoPlayerRef.value.setAttribute('x5-video-player-fullscreen', false)
  }

  if (props.crossOrigin) {
    videoPlayerRef.value.crossOrigin = props.crossOrigin
    videoPlayerRef.value.setAttribute('crossOrigin', props.crossOrigin)
  }
}

const aspectRatioDeal = () => {
  if (!props.aspectRatio) return
  const dom: any = player.value?.el().firstChild
  const ratioArr = props.aspectRatio.split(':')
  const ratioW = Number(ratioArr[0])
  const ratioH = Number(ratioArr[1])

  const coreFunc = () => {
    const width = (videoPlayerRef.value.clientHeight / ratioH) * ratioW
    dom.style.width = `${width}px`
    dom.style.background = `black`
    dom.style.left = `50%`
    dom.style.transform = `translateX(-50%)`
  }
  player.value?.on('fullscreenchange', coreFunc)
  coreFunc()
}

const customEleDeal = () => {
  const domPlayer: any = player.value?.el()
  const domVideo = domPlayer.firstElementChild
  const domPlayBtn: any = player.value?.getChild('BigPlayButton')?.el()
  domPlayer.insertBefore(blurBgRef.value, domVideo)
  domPlayer.insertBefore(customLayoutRef.value, domPlayBtn)
}

const eventDeal = (inst) => {
  inst.emit('ready', player.value)
  mergeEvents.value!.forEach((val) => {
    player.value?.on(val, () => {
      inst.emit(val)
    })
  })
}

const clickBg = () => {
  if (player.value?.paused()) {
    player.value?.play()
  } else {
    player.value?.pause()
  }
}

const dblclickBg = () => {
  if (player.value?.isFullscreen()) {
    player.value?.exitFullscreen()
  } else {
    player.value?.requestFullscreen()
  }
}

const init = () => {
  const controlBar = { ...defaultOpts.controlBar, ...props.controlBar }
  mergeOpts.value = {
    ...defaultOpts,
    autoplay: props.autoplay,
    loop: props.loop,
    controls: props.controls,
    controlBar,
    poster: props.poster,
    sources: [
      {
        src: props.path,
        type: 'video/mp4'
      }
    ]
  }
  mergeEvents.value = new Set([...defaultEvents, ...props.events])
}

init()
</script>

<template>
  <div
    class="vjs-custom-skin"
    :class="{ 'vjs-has-poster': !!mergeOpts.poster }"
  >
    <video ref="videoPlayerRef" class="video-js"></video>
    <div
      ref="blurBgRef"
      class="vjs-blur-bg"
      :style="{
        'background-image': !!props.blurBg ? `url(${props.blurBg})` : 'none'
      }"
      @click="clickBg"
      @dblclick="dblclickBg"
    ></div>
    <div ref="customLayoutRef" class="vjs-custom-layout">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
