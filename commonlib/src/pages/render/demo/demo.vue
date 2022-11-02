<template>
  <view class="page">
    <Render
      class="render"
      @init="init"
      @loop="loop"
      @touch-event="handleTouch"
    ></Render>
    <view class="score">{{ score }}</view>
    <view v-if="btnTxt" class="btn" @click="click">{{ btnTxt }}</view>
  </view>
</template>

<script setup lang="ts">
import { onHide } from '@dcloudio/uni-app'
import Render from '@lib/components/render/render.vue'
import { computed, ref } from 'vue'

enum GAME_STATUS {
  UNSTART,
  PLAY,
  PAUSE,
  END
}

const gameStatus = ref(GAME_STATUS.UNSTART)
let touchStart = 0
const score = ref(0)
const maxScore = 10
const anims = getAnims()
let renderInst: ZKit.Render
let schedule: ZKit.ScheduleRet
let hero: ZKit.Anim
const presentArr: ZKit.Anim[] = []

const btnTxt = computed(() => {
  let ret = ''
  if (gameStatus.value === GAME_STATUS.UNSTART) {
    ret = '开始游戏'
  }
  if (gameStatus.value === GAME_STATUS.PAUSE) {
    ret = '继续游戏'
  }
  if (gameStatus.value === GAME_STATUS.END) {
    ret = '重新开始'
  }
  return ret
})

function getAnims() {
  function getResWebpArr(name, num) {
    const ret: string[] = []
    for (let i = 0; i < num; i++) {
      ret.push(
        `https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/wly-webp/${name}/${name}${i}.webp`
      )
    }
    return ret
  }

  const bossIdleAnim = {
    width: 350,
    height: 543,
    resArr: getResWebpArr('boss-idle', 26)
  }

  const bossInjureAnim = {
    width: 350,
    height: 543,
    resArr: getResWebpArr('boss-injure', 25)
  }

  const bossDeadAnim = {
    width: 350,
    height: 543,
    resArr: getResWebpArr('boss-dead', 26)
  }

  return { bossIdleAnim, bossInjureAnim, bossDeadAnim }
}

const getNFromM = (m, n) => {
  const arr: number[] = []
  for (let i = 0; i < m; i++) {
    arr.push(i)
  }

  const ret: number[] = []
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * arr.length)
    ret.push(arr[index])
    arr.splice(index, 1)
  }

  return ret
}

onHide(() => {
  gameStatus.value = GAME_STATUS.PAUSE
  schedule.pause = true
})

const init = async (val: ZKit.Render) => {
  renderInst = val
  addHero()
}

const loop = (delta: number) => {
  if (gameStatus.value !== GAME_STATUS.PLAY) return
  movePresent(delta)
}

const handleTouch = (payload: TouchEvent) => {
  if (gameStatus.value !== GAME_STATUS.PLAY) return
  const { type, touches } = payload

  if (type === 'touchstart') {
    const { x, y } = touches[0] as any
    touchStart = zkit.utils.px2rpx(x)
  }

  if (type === 'touchmove') {
    const { x, y } = touches[0] as any
    hero.x += zkit.utils.px2rpx(x) - touchStart
    touchStart = zkit.utils.px2rpx(x)
  }
}

const click = () => {
  if (gameStatus.value === GAME_STATUS.END) {
    gameRestart()
    addPresent()
  }
  if (gameStatus.value === GAME_STATUS.UNSTART) {
    addPresent()
  }
  if (gameStatus.value === GAME_STATUS.PAUSE) {
    schedule.pause = false
  }
  gameStatus.value = GAME_STATUS.PLAY
}

const addHero = () => {
  hero = renderInst.createAnim(anims.bossIdleAnim.resArr)
  renderInst.addChild(hero)
  hero.x = renderInst.canvasW / 2
  hero.y = renderInst.canvasH - 100
  hero.w = 200
  hero.h = 200
}

const addPresent = () => {
  const presentSize = 100
  const start = 25
  const randomCnt = Math.floor(Math.random() * 3) + 2
  const posArr: any = getNFromM(7, randomCnt)
  const delay = Math.random() * 1000 + 1000

  for (let i = 0; i < randomCnt; i++) {
    const present = renderInst.createAnim(anims.bossInjureAnim.resArr)
    renderInst.addChild(present)
    present.x = start + posArr[i] * presentSize + presentSize / 2
    present.y = -presentSize / 2
    present.w = presentSize
    present.h = presentSize
    presentArr.push(present)
  }

  schedule = renderInst.schedule(addPresent, delay, 1)
}

const movePresent = (delta: number) => {
  const delIndex: number[] = []
  presentArr.forEach((val, index) => {
    val.y += (200 * delta) / 1000
    if (
      Math.abs(val.x - hero.x) < val.w / 2 + hero.w / 2 &&
      Math.abs(val.y - hero.y) < val.h / 2 + hero.h / 2
    ) {
      val.removeFromParent()
      delIndex.push(index)
      score.value++
      if (score.value >= maxScore) {
        gameEnd()
      }
    }
  })
  for (let i = delIndex.length - 1; i >= 0; i--) {
    presentArr.splice(delIndex[i], 1)
  }
}

const gameEnd = () => {
  gameStatus.value = GAME_STATUS.END
  schedule.stop = true
}

const gameRestart = () => {
  score.value = 0
  presentArr.forEach((val) => {
    val.removeFromParent()
  })
  presentArr.length = 0
  hero.x = renderInst.canvasW / 2
}
</script>

<style scoped lang="scss">
.render {
  width: 100%;
  height: 100%;
}
.score {
  position: absolute;
  left: 50rpx;
  top: 50rpx;
  width: 100rpx;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 50rpx;
  color: black;
  background-color: antiquewhite;
}

.btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  background-color: antiquewhite;
}
</style>
