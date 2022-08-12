<template>
  <view class="zkit-com-record-btn">
    <RecordCore @record-end="recordEnd" @error="handleError">
      <template #default="{ scope }">
        <view class="record-btn">
          <view
            class="center"
            :class="{
              start:
                scope >= RECORD_STATUS.READY && scope <= RECORD_STATUS.RECORD
            }"
          >
            record
          </view>
        </view>
      </template>
    </RecordCore>
  </view>
</template>

<script setup lang="ts">
import RecordCore from '@/components/record/recordCore.vue'
import { RECORD_STATUS } from './recordConstant'

const emits = defineEmits<{
  (event: 'record-end', src: string): void
  (event: 'error', msg, err?): void
}>()

const recordEnd = async (src: string) => {
  emits('record-end', src)
}

const handleError = (msg, e) => {
  emits('error', msg, e)
}
</script>

<style lang="scss">
.zkit-com-record-btn {
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
      &.start {
        background-color: brown;
      }
    }
  }
}
</style>
