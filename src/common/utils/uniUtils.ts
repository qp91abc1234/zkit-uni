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
