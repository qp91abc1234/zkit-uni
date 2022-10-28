<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<script lang="ts">
const globalData: App.IGlobalData = {
  tst: 'text'
}
export default {
  globalData
}
</script>

<style lang="scss">
@import '@lib/common/scss/app.scss';
</style>
