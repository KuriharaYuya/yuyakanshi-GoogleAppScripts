function assignTaskToCal(tasksToAdd, backlogRange) {
  const eveningTime = new Date();
  eveningTime.setHours(19, 0, 0, 0);

  for (let i = 0; i < tasksToAdd.length; i++) {
    const task = tasksToAdd[i];
    const title = renameTask(task);
    const start = new Date(eveningTime.getTime() + i * 60 * 60 * 1000);

    // タスク名から時間を抽出し、15の倍数か確認
    const durationMinutes = parseInt(task.asp, 10);
    const duration = (durationMinutes % 15 === 0) ? durationMinutes : 60; // 15の倍数でなければ60分

    // 終了時間の設定
    const end = new Date(start.getTime() + duration * 60 * 1000); // 指定した分数後
    Logger.log("タスクを追加: " + title + " 開始時間: " + start + " 終了時間: " + end);
    calendar.createEvent(title, start, end);

    // added to cをwriteする
    const id = parseInt(task.id, 10);
    const taskCol = parseInt(id + backlogRange[0] - 1, 10);
    const taskRow = parseInt(backlogRange[1], 10);
    const tgtCellName = getCellAlp(taskCol, taskRow);

    const cell = shD.getRange(tgtCellName);
    cell.setValue("TRUE");
  }
}

function unassignTasksFromCal(t, e, r) {
  // calenderを用いてtと
}


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





function renameTask(task) {
  // priorityとaspを文字列に変換
  const priority = task.priority;
  const aspString = String(task.asp);

  // 新しい名前のフォーマット: "#[Priority][ASP]:[Name]"
  return `#${priority}${aspString}:${task.name}`;
}