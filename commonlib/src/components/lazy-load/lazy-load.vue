<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance
} from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    id?: string
    mode?: string
    placeholdImg?: string
    errorImg?: string
    threshold?: number
    immediate?: boolean
  }>(),
  {
    src: '',
    id: '',
    mode: 'scaleToFill',
    placeholdImg: '',
    errorImg:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAMAAAC3Ycb+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODdDMjhENDYyQUQ2MTFFQTlDQ0VBODgxQjFFOEEyMEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODdDMjhENDcyQUQ2MTFFQTlDQ0VBODgxQjFFOEEyMEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4N0MyOEQ0NDJBRDYxMUVBOUNDRUE4ODFCMUU4QTIwQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4N0MyOEQ0NTJBRDYxMUVBOUNDRUE4ODFCMUU4QTIwQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhLwhikAAAAzUExURZWVldfX162t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',
    threshold: 300,
    immediate: false
  }
)

const emits = defineEmits<{
  (event: 'loaded', id: string): void
  (event: 'error', id: string): void
}>()

const inst = getCurrentInstance()
let contentObserver: UniApp.IntersectionObserver | undefined
const status = ref('unload')

const getSrc = computed(() => {
  let ret = ''
  if (status.value === 'error') {
    ret = props.errorImg
  } else if (status.value === 'unload') {
    ret = props.placeholdImg
  } else {
    ret = props.src
  }
  return ret
})

onMounted(() => {
  if (props.immediate) {
    status.value = 'load'
    return
  }
  contentObserver && contentObserver.disconnect()
  contentObserver = uni.createIntersectionObserver(inst)
  contentObserver
    .relativeToViewport({
      bottom: props.threshold
    })
    .observe('.nd-lazy-item', (res) => {
      if (res.intersectionRatio > 0) {
        status.value = 'load'
        contentObserver && contentObserver.disconnect()
        contentObserver = undefined
      }
    })
})

onBeforeUnmount(() => {
  contentObserver && contentObserver.disconnect()
})

function loaded() {
  if (status.value !== 'load') return
  status.value = 'loaded'
  emits('loaded', props.id || props.src)
}

function error() {
  if (status.value !== 'load') return
  status.value = 'error'
  emits('error', props.id || props.src)
}
</script>

<template>
  <image
    class="nd-lazy-item img"
    :class="{ 'width-fix': props.mode === 'widthFix' }"
    :src="getSrc"
    :mode="mode"
    @load="loaded"
    @error="error"
  ></image>
</template>

<style scoped lang="scss">
.img {
  width: 100%;
  height: 100%;
  &.width-fix {
    height: 450rpx;
  }
}
</style>
