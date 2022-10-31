export const setupGlobal = () => {
  Object.defineProperty(uni, 'baby', {
    value: {
      sayHello() {
        wx.showToast({
          icon: 'none',
          title: 'hello'
        })
      }
    },
    configurable: false,
    enumerable: false
  })
}
