<template>
  <view class="page">
    {{ hello }}
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hello = ref('hello world~')
</script>

<style scoped lang="scss"></style>
