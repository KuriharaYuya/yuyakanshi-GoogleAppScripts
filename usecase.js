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
  // カレンダーから予定を取得する
  // 命名規則から優先度を取得する
  // nameや所要時間なども取得
  // mtgの場合、

  // memo: 優先度はプルダウンではなく、条件付き書式に変更する
}