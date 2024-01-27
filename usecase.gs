// github.com
// https://github.com/KuriharaYuya/yuyakanshi-GoogleAppScripts/tree/main


function addStanbyTaskToCal () {
  // backlogとcalをload
  const contents = loadBacklogAndCal()

  const h = contents.task.hash
  const r = contents.task.range
  const sb = contents.scheduleBuf

  // stanbyとなっていて、かつカレンダーに追加されていないタスクを抽出
  const t = extractStanbyTasks(h, sb)
  
  // 19時以降にカレンダーアサインし、sheetもupdateする
  assignTaskToCal(t,r)
}

function removeUnStanbyTaskToCal () {

  // backlogとcalをload
  const contents = loadBacklogAndCal()

  const h = contents.task.hash
  const r = contents.task.range
  const sb = contents.scheduleBuf


  // unstanbyで、カレンダーに追加されているものを削除する
  const tasksAndEvents = extractUnstanbyTask(h, sb);

  // カレンダーから削除 && added cを塗り替えを回す。
  unassignTasksFromCal(tasksAndEvents, r)
}

function inputScheduleToBacklog () {
    const contents = loadBacklogAndCal()
    const h = contents.task.hash
    const br = contents.task.range
    const sb = contents.scheduleBuf  
    const et = contents.task.emptyTaskIds

  // backlogのタスクを取得する関数の戻り値に、空いてる行数を数字で配列で返却させる

  const eaColumns = getEmptyAreaInBacklog(br,et)

  // scheduleBufから、backlogに存在しないものを特定する
  const st = extractTasksFromSchedule(sb,h)
  const at = backlogHashFilter("priority","予定", st)

  // そしたらこれを空いてるeaColumnsに上から順にsetvalueしていく
  inputAppointToBacklog(eaColumns,at)
}

function inputCalenderResultsToSheet () {
  // backlogとcalをload
  const contents = loadBacklogAndCal()

  const h = contents.task.hash
  const sb = contents.scheduleBuf
  const ir =  getScheduleInputRange()
  
  const st = extractTasksFromSchedule(sb,null)
  inputScheduleToSheet(ir,st, h)
}