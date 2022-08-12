<template>
  <view class="zkit-com-record-view">
    <RecordCore class="record" @record-end="recordEnd" @auth-deny="authDeny">
      <template #default="{ scope }">
        <view class="record-btn">
          <view
            class="center"
            :class="{
              start: scope === 'start'
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

const emits = defineEmits<{
  (event: 'record-end', src: string): void
}>()

const recordEnd = async (src: string) => {
  emits('record-end', src)
}

const authDeny = (e) => {
  uni.showModal({
    title: '提示',
    content: '请通过右上角胶囊按钮，进入设置开启授权~',
    showCancel: false
  })
}
</script>

<style lang="scss">
.zkit-com-record-view {
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
        &.start {
          background-color: brown;
        }
      }
    }
  }
}
</style>
