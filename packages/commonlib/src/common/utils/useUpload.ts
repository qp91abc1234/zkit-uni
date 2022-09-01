import { isJsonStr } from '@lib/common/utils'

export const useUpload = () => {
  const getUploadUrl = async (url, filename) => {
    try {
      const ret: any = await new Promise((resolve, reject) => {
        uni.request({
          url: `${url}?file_name=${filename}`,
          method: 'GET',
          header: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjIwMDEsInBsYXllcl9pZCI6IjVmNGRlOTFmNDBmZDE5Y2JkNzEzNzhhZCIsInBsYXRmb3JtX2lkIjoiMTEwIiwidXNlcl9kYXRhIjoiIiwiaWF0IjoxNjU5NjA1NzU3LCJleHAiOjE2NTk2MTI5NTcsImp0aSI6InB5bmdtdGN5bzJuZW1qbHI5bnF3dWtvdXY1bHplemVhIn0.9iawB933BqRSvheTez3YjY65bPPoczsOIuVWS0Zapg4`
          },
          data: {
            seq: 1,
            ts: new Date().getTime(),
            game_app_id: 'pyngmtcyo2nemjlr9nqwukouv5lzezea',
            platform_id: '110',
            user_id: '5f6f43d40901280cd9d99798'
          },
          success: (res) => {
            resolve(res.data)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })

      // 判断是否json字符串，将其转为json格式
      const data = isJsonStr(ret.data) ? JSON.parse(ret.data) : ret.data
      if (![200, 201, 204].includes(ret.code)) {
        uni.showToast({ title: '获取上传地址失败~' })
      } else {
        return ret.data
      }
    } catch (e) {
      console.log(e)
      uni.showToast({ title: '获取上传地址失败~' })
    }

    return null
  }

  const upload = async (filepath, data) => {
    const buf = uni.getFileSystemManager().readFileSync(filepath)
    const ret: any = await new Promise((resolve, reject) => {
      uni.request({
        url: data.url,
        method: 'PUT',
        header: {
          'Content-Type': 'audio/mpeg',
          'x-amz-acl': 'public-read'
        },
        timeout: 30000,
        data: buf,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })

    if (ret.statusCode === 200) {
      return data.url.split('?')[0]
    }

    return null
  }

  return {
    getUploadUrl,
    upload
  }
}