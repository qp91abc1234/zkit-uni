import { useLibStore } from '@lib/pinia/libStore'

export function CORSPathRewrite(val: string) {
  const newVal = val.replace('https://cdn-s3-gjzc.my.99.com', '')
  return newVal
}

export function rpx2px(val: number) {
  const libtore = useLibStore()
  return (libtore.windowW / 750) * val
}

export function px2rpx(val: number) {
  const libtore = useLibStore()
  return (val * 750) / libtore.windowW
}

export function toPromiseStyle(cb, params = {}) {
  return new Promise((resolve, reject) => {
    cb({
      ...params,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
