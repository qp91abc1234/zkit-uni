<template>
  <div class="page"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useCanvas } from '@lib/common/utils/useCanvas'
</script>

<style scoped lang="scss">
.page {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
