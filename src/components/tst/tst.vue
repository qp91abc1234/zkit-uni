<template>
  <view class="content"> zcc </view>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'

onBeforeMount(() => {
  console.log('com onBeforeMount')
})

onMounted(() => {
  console.log('com onMounted')
})

console.log('com setup')
</script>

<style scoped lang="scss">
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
