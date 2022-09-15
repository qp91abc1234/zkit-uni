<template>
  <div class="main">
    {{ hello }}
    <tst></tst>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import tst from '@lib/components/tst/tst.vue'

const hello = ref('hello world~')
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
}
</style>
