<script setup lang="ts">
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: any[]
    addTime?: number
    idKey?: string
  }>(),
  {
    modelValue: () => {
      return []
    },
    addTime: 200,
    idKey: 'id'
  }
)

defineExpose({
  modify,
  remove,
  clear
})

const emits = defineEmits<{
  (event: 'update:modelValue', val: []): void
  (event: 'render-end'): void
}>()

const inst = getCurrentInstance()
const leftList = ref<any[]>([])
const rightList = ref<any[]>([])
const tempList = ref<any[]>([])

const copyFlowList = computed(() => {
  const ret = cloneData(props.modelValue)
  return ret
})

watch(
  () => {
    return copyFlowList.value
  },
  (nVal, oVal) => {
    // 取差值，即这一次数组变化新增的部分
    const startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0
    // 拼接上原有数据
    tempList.value = tempList.value.concat(cloneData(nVal.slice(startIndex)))
    splitData()
  }
)

onMounted(() => {
  tempList.value = cloneData(copyFlowList.value)
  splitData()
})

function cloneData(data) {
  return JSON.parse(JSON.stringify(data))
}

function getRect(selector, all = false) {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery().in(inst)
    query[all ? 'selectAll' : 'select'](selector)
      .boundingClientRect((rect) => {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect)
        }
        if (!all && rect) {
          resolve(rect)
        }
      })
      .exec()
  })
}

async function splitData() {
  if (!tempList.value.length) return
  const leftRect = (await getRect('#nd-left-column')) as UniApp.NodeInfo
  const rightRect = (await getRect('#nd-right-column')) as UniApp.NodeInfo
  // 如果左边小于或等于右边，就添加到左边，否则添加到右边
  const item = tempList.value[0]
  // 解决多次快速上拉后，可能数据会乱的问题，因为经过上面的两个await节点查询阻塞一定时间，加上后面的定时器干扰
  // 数组可能变成[]，导致此item值可能为undefined
  if (!item) return
  if (leftRect.height && rightRect.height) {
    if (leftRect.height <= rightRect.height) {
      leftList.value.push(item)
    } else if (leftRect.height > rightRect.height) {
      rightList.value.push(item)
    }
  } else {
    // 这里是为了保证第一和第二张添加时，左右都能有内容
    // 因为添加第一张，实际队列的高度可能还是0，这时需要根据队列元素长度判断下一个该放哪边
    if (leftList.value.length <= rightList.value.length) {
      leftList.value.push(item)
    } else {
      rightList.value.push(item)
    }
  }

  // 移除临时列表的第一项
  tempList.value.splice(0, 1)
  // 如果临时数组还有数据，继续循环
  if (tempList.value.length) {
    setTimeout(() => {
      splitData()
    }, props.addTime)
  } else {
    setTimeout(() => {
      emits('render-end')
    }, props.addTime)
  }
}

function modify(id, value) {
  // 如果findIndex找不到合适的条件，就会返回-1
  let index = -1
  index = leftList.value.findIndex((val) => val[props.idKey] === id)
  if (index !== -1) {
    // 如果index不等于-1，说明已经找到了要找的id，修改对应key的值
    leftList.value[index] = value
  } else {
    // 同理于上方面的方法
    index = rightList.value.findIndex((val) => val[props.idKey] === id)
    if (index !== -1) rightList.value[index] = value
  }
  // 修改父组件的数据中的对应id的条目
  index = props.modelValue.findIndex((val) => val[props.idKey] === id)
  if (index !== -1) {
    // 首先复制一份value的数据
    const data = cloneData(props.modelValue)
    // 修改对应索引的key属性的值为value
    data[index] = value
    // 修改父组件通过v-model绑定的变量的值
    emits('update:modelValue', data)
  }
}

function remove(id) {
  // 如果findIndex找不到合适的条件，就会返回-1
  let index = -1
  index = leftList.value.findIndex((val) => val[props.idKey] === id)
  if (index !== -1) {
    // 如果index不等于-1，说明已经找到了要找的id，根据index索引删除这一条数据
    leftList.value.splice(index, 1)
  } else {
    // 同理于上方面的方法
    index = rightList.value.findIndex((val) => val[props.idKey] === id)
    if (index !== -1) rightList.value.splice(index, 1)
  }
  // 同时清除父组件的数据中的对应id的条目
  index = props.modelValue.findIndex((val) => val[props.idKey] === id)
  if (index !== -1)
    emits('update:modelValue', cloneData(props.modelValue).splice(index, 1))
}

function clear() {
  leftList.value = []
  rightList.value = []
  // 同时清除父组件列表中的数据
  emits('update:modelValue', [])
  tempList.value = []
}
</script>

<template>
  <view class="nd-waterfall">
    <view id="nd-left-column" class="nd-column">
      <slot name="left" :left-list="leftList"></slot>
    </view>
    <view id="nd-right-column" class="nd-column">
      <slot name="right" :right-list="rightList"></slot>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.nd-waterfall {
  flex-direction: row;
  align-items: flex-start;
}
.nd-column {
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: auto;
}
</style>
