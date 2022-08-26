<template>
  <view class="content">
    <xxx></xxx>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import xxx from '@mono/comlib'

const title = ref('Hello')
</script>

<style>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
