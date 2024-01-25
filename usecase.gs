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

function inputCalenderResultsToSheet () {
  // backlogとcalをload
  const contents = loadBacklogAndCal()

  const h = contents.task.hash
  const sb = contents.scheduleBuf
  const ir =  getScheduleInputRange()
  
  const st = extractTasksFromSchedule(sb)
  inputScheduleToSheet(ir,st, h)
}