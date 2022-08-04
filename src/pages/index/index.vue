<template>
  <view class="content">
    <Record class="record" @record-end="recordEnd">
      <template #default="{ scope }">
        <view class="record-btn">
          <view
            class="center"
            :class="{
              recording: scope === 'record',
              start: scope === 'start'
            }"
          >
            record
          </view>
        </view>
      </template>
    </Record>
  </view>
</template>

<script setup lang="ts">
import Record from '@/components/record/record.vue'
import { useAudio } from '@/common/utils/useAudio'

const audioCtx = useAudio()

const recordEnd = (src, emptyTime) => {
  setTimeout(() => {
    audioCtx.play(src, emptyTime)
  }, 1000)
}
</script>

<style scoped lang="scss">
.content {
  position: absolute;
  width: 100%;
  height: 100%;
  .record {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    .record-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 170rpx;
      height: 170rpx;
      border-radius: 50%;
      background-color: rgb(238 175 175);
      .center {
        width: 150rpx;
        height: 150rpx;
        border-radius: 50%;
        text-align: center;
        color: antiquewhite;
        background-color: palevioletred;
        line-height: 150rpx;
        &.recording {
          background-color: beige;
        }
        &.start {
          background-color: brown;
        }
      }
    }
  }
}
</style>
