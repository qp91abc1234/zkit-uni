<template>
  <view class="content">
    <Record></Record>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import Record from '@/components/record/record.vue'

onLoad(() => {
  console.log('page onload')
})

onShow(() => {
  console.log('page onShow')
})

onReady(() => {
  console.log('page onReady')
})
</script>

<style scoped lang="scss">
.content {
  display: flex;
}
</style>
