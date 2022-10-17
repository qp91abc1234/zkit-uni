<template>
  <div class="main">
    {{ hello }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hello = ref('hello world~')
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
}
</style>
