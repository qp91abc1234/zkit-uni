<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoadAnim from '@/modules/load-anim/load-anim.vue'

const props = withDefaults(
  defineProps<{
    getData: (page: number) => Promise<number>
    size?: number
    emptyText?: string
  }>(),
  {
    getData: () => Promise.resolve(0),
    size: 20,
    emptyText: '没有数据'
  }
)

let page = 1
let dataLen = 0
const isLoading = ref(false)
const isEmpty = ref(false)
const isNoMore = ref(false)

onMounted(() => {
  getData()
})

const getData = async () => {
  if (isLoading.value || isNoMore.value) return
  try {
    isLoading.value = true
    const curDataLen = await props.getData(page)
    isEmpty.value = curDataLen === 0
    isNoMore.value = curDataLen - dataLen < props.size
    dataLen = curDataLen
    page++
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}

const reachBottom = async () => {
  try {
    await getData()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <view class="scroll-wraper">
    <scroll-view class="scroll" scroll-y="true" @scrolltolower="reachBottom">
      <slot></slot>
      <view v-if="isLoading" class="loading">
        <slot name="loading">
          <view class="loading-text">
            <LoadAnim></LoadAnim>
            加载中
          </view>
        </slot>
      </view>
      <view v-else-if="isEmpty" class="empty">
        <slot name="empty">
          <text class="empty-text">{{ emptyText }}</text>
        </slot>
      </view>
      <view v-else-if="isNoMore" class="no-more">
        <slot name="nomore">
          <view class="no-more-text">- 到底了 -</view>
        </slot>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.scroll-wraper {
  position: relative;
  width: 100%;
  height: 100%;
  .scroll {
    position: absolute;
    width: 100%;
    height: 100%;
    ::-webkit-scrollbar {
      display: none;
    }
    .loading-text {
      flex-direction: row;
      @include flex-center;

      font-size: 26rpx;
      color: #67717c;
    }
    .no-more-text {
      font-size: 26rpx;
      text-align: center;
      color: #67717c;
    }
  }
}
</style>
