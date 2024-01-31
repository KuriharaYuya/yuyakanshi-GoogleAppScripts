function extractStanbyTasks(hash, scheduleBuf) {
  const stanbyTasks = backlogHashFilter("stanby", true, hash);

  // stanbyTasksの中でカレンダーに追加されていないものだけを返却
  const tasksToAdd = stanbyTasks.filter(task => {
    // タスクの名前がカレンダーの予定のタイトルに含まれていないかどうかをチェック
    return !scheduleBuf.some(event => event.title.includes(task.name));
  });
  return tasksToAdd;
}


function assignTaskToCal(tasksToAdd, backlogRange) {
  const timeZero = " 17:00:00";
  const startDate = sp.getName();
  const eveningTime = new Date(startDate + timeZero);

  for (let i = 0; i < tasksToAdd.length; i++) {
    const task = tasksToAdd[i];
    const title = renameTask(task);
    const start = new Date(eveningTime.getTime() + i * 60 * 60 * 1000);

    // タスク名から時間を抽出し、15の倍数か確認
    const durationMinutes = parseInt(task.asp, 10);
    const duration = (durationMinutes % 15 === 0) ? durationMinutes : 60; // 15の倍数でなければ60分

    // 終了時間の設定
    const end = new Date(start.getTime() + duration * 60 * 1000); // 指定した分数後
    Logger.log("in assignTaskToCal");
    Logger.log("タスクを追加: " + title + " 開始時間: " + start + " 終了時間: " + end);
    poni3Calendar.createEvent(title, start, end);

    // added to cをwriteする
    const id = parseInt(task.id, 10);
    const taskCol = parseInt(id + backlogRange[0] - 1, 10);
    const taskRow = parseInt(backlogRange[1], 10);
    const tgtCellName = getCellAlp(taskCol, taskRow);

    const cell = shD.getRange(tgtCellName);
    cell.setValue("TRUE");
  }
}