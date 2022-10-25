<template>
  <view class="page">
    <button
      class="item"
      v-for="item in cfg"
      :key="item.name"
      @click="click(item.path)"
    >
      {{ item.name }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const cfg = ref<{ name: string; path: string }[]>([])

const initCfg = () => {
  const modules = import.meta.glob('../*/*.vue')
  const modPaths = Object.keys(modules)
  for (let i = 0; i < modPaths.length; i++) {
    const path = modPaths[i]
    if (path === './home.vue') continue
    cfg.value.push({
      name: path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.')),
      path: path.replace('../', '/pages/').replace('.vue', '')
    })
  }
}

const click = (path) => {
  uni.navigateTo({
    url: path
  })
}

initCfg()
</script>

<style scoped lang="scss">
.page {
  align-items: center;
  overflow-y: scroll;
  .item {
    margin: 20rpx;
  }
}
</style>
