<template>
  <div class="main">
    {{ hello }}
    {{ instance.name }}
    <xxx></xxx>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import xxx from '@lib/pages/xxx/xxx.vue'
import Axios from 'axios'

const hello = ref('hello world~')
const instance = Axios.create({
  baseURL: '',
  timeout: 30000
})
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
}
</style>
