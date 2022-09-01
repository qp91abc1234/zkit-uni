<template>
  <view class="home">
    <view
      class="item"
      v-for="item in demoCfg"
      :key="item.url"
      @click="handleClickItem(item.url)"
      >{{ item.title }}</view
    >
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const demoCfg = ref([
  {
    title: 'record',
    url: '/pages/record/record'
  }
])

const handleClickItem = (url: string) => {
  uni.navigateTo({
    url
  })
}
</script>

<style scoped lang="scss">
.home {
  position: absolute;
  display: flex;
  align-items: center;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .item {
    margin: 30rpx 0;
    width: 200rpx;
    height: 100rpx;
    font-size: 30rpx;
    border-radius: 13rpx;
    text-align: center;
    color: #ffffff;
    background-color: purple;
    line-height: 100rpx;
  }
}
</style>
