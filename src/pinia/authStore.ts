import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const authInfo: any = {}

  const getAuthInfo = async (scope: string) => {
    if (scope in authInfo) {
      return authInfo[scope]
    }

    const ret = await new Promise((resolve) => {
      uni.getSetting({
        success(res) {
          authInfo[scope] = res.authSetting[scope]
          resolve(authInfo[scope])
        },
        fail(e) {
          resolve(e)
        }
      })
    })
    return ret
  }

  const setAuthInfo = (scope: string) => {
    return new Promise((resolve) => {
      // 如果用户已拒绝授权，则不会出现弹窗
      uni.authorize({
        scope,
        success() {
          authInfo[scope] = true
          resolve(authInfo[scope])
        },
        fail(e) {
          console.log('uniUtils setAuthInfo fail ~ ', e)
          authInfo[scope] = e
          resolve(authInfo[scope])
        }
      })
    })
  }

  return {
    getAuthInfo,
    setAuthInfo
  }
})
