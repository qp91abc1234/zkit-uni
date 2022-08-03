<template>
  <view class="content">
    <Record class="record"></Record>
  </view>
</template>

<script setup lang="ts">
import Record from '@/components/record/record.vue'
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
  }
}
</style>
