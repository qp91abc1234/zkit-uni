<template>
  <div class="main">
    {{ hello }}
    <xxx></xxx>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import xxx from '@lib/pages/xxx/xxx.vue'

const hello = ref('hello world~')
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
}
</style>
