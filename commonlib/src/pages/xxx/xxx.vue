<template>
  <div class="main">
    {{ hello }}
    {{ instance.name }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
