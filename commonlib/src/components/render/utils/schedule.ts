export default class Schedule {
  private scheduleArr: ZKit.ScheduleObj[] = []

  add(
    cb: (val: number) => void,
    interval: number = 0,
    loop: number = -1
  ): ZKit.ScheduleRet {
    const obj = {
      cb,
      interval,
      loop,
      pause: false,
      stop: false,
      startT: new Date().getTime(),
      curT: new Date().getTime()
    }
    this.scheduleArr.push(obj)
    return obj
  }

  run(delta: number) {
    const delIndex: number[] = []
    this.scheduleArr.forEach((ele: ZKit.ScheduleObj, index: number) => {
      if (ele.pause) {
        return
      }
      if (ele.stop) {
        delIndex.push(index)
        return
      }
      ele.curT += delta
      if (ele.curT >= ele.startT + ele.interval) {
        ele.cb(ele.curT - ele.startT)
        ele.loop = ele.loop > 0 ? ele.loop - 1 : ele.loop
        if (ele.loop === 0) {
          delIndex.push(index)
        } else {
          ele.startT += ele.interval
        }
      }
    })
    for (let i = delIndex.length - 1; i >= 0; i--) {
      this.scheduleArr.splice(delIndex[i], 1)
    }
  }
}
