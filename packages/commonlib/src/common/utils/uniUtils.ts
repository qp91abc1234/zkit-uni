export const getBoundingInfo = (id: string, com) => {
  return new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery().in(com)
    query
      .select(`#${id}`)
      .boundingClientRect((data) => {
        resolve(data)
      })
      .exec()
  })
}

export const getAuthInfo = (scope: string) => {
  return new Promise((resolve) => {
    uni.getSetting({
      success(res) {
        resolve(res.authSetting[scope])
      },
      fail(e) {
        resolve(e)
      }
    })
  })
}

export const setAuthInfo = (scope: string) => {
  return new Promise((resolve) => {
    // 如果用户已拒绝授权，则不会出现弹窗
    uni.authorize({
      scope,
      success() {
        resolve(true)
      },
      fail(e) {
        resolve(e)
      }
    })
  })
}
