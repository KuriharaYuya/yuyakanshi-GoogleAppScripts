function extractUnstanbyTask(taskHash, scheduleBuf) {
  // スタンバイ状態でないタスクをフィルタリング
  const unstanbyTasks = backlogHashFilter("stanby", false, taskHash);

  // カレンダーに追加されているスタンバイでないタスクと対応するイベントを特定
  const tasksAndEvents = unstanbyTasks.flatMap(task => {
    // 対応するイベントを検索
    const matchingEvents = scheduleBuf.filter(event => event.title.includes(task.name));

    // タスクと対応するイベントのペアを作成
    return matchingEvents.map(event => ({ task, event }));
  });

  return tasksAndEvents;
//   [
//   {
//     task: {
//       // タスクの詳細（id, name, priority, aspなど）
//     },
//     event: {
//       title: String,   // イベントのタイトル
//       startTime: Date, // イベントの開始時間
//       endTime: Date    // イベントの終了時間
//     }
//   },
// ]
}



function unassignTasksFromCal(tasksAndEvents, r) {
  // タスクとイベントのペアをループ
  tasksAndEvents.forEach(pair => {
    const task = pair.task;
    Logger.log("in unassignTasksFromCal")
    Logger.log(task)
    const rawEvent = pair.event.rawEvent;

    // カレンダーからイベントを削除
    if (rawEvent && rawEvent.deleteEvent) {
      rawEvent.deleteEvent();
    }

    // シートの対応するセルを更新
    const id = parseInt(task.id, 10);
    const taskCol = parseInt(id + r[0] - 1, 10);
    const taskRow = parseInt(r[1], 10);
    const tgtCellName = getCellAlp(taskCol, taskRow);

    const cell = shD.getRange(tgtCellName);
    cell.setValue("FALSE"); // タスクの状態に応じて適切な値に更新
  });
}