<template>
  <view class="content">
    <RecordView @record-end="recordEnd"> </RecordView>
  </view>
</template>

<script setup lang="ts">
import RecordView from '@/components/record/recordView.vue'
import { useAudio } from '@/common/utils/useAudio'

const audioCtx = useAudio()

const recordEnd = (src: string) => {
  setTimeout(() => {
    audioCtx.play(src)
  }, 1000)
}
</script>

<style scoped lang="scss"></style>
