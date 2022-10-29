import { useLibStore } from '@lib/pinia/libStore'

export function CORSPathRewrite(val: string) {
  const newVal = val.replace('https://cdn-s3-gjzc.my.99.com', '')
  return newVal
}

export function rpx2px(val: number) {
  const libStore = useLibStore()
  return (libStore.windowW / 750) * val
}

export function px2rpx(val: number) {
  const libStore = useLibStore()
  return (val * 750) / libStore.windowW
}
