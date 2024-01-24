function loadBacklogAndCal() {
  // backlogの範囲を取得
  const task = getBackLogTaskRangeBuf(); // return {hash: hash,range: range}

  // カレンダーを読み込んでbufに
  const scheduleBuf = getTodaySchedule();

  // task と scheduleBuf をオブジェクトとして返す
  return { task, scheduleBuf };
  
  // // backlogとcalをload
  // const contents = loadBacklogAndCal()

  // const h = contents.task.hash
  // const r = contents.task.range
  // const sb = contents.scheduleBuf
}