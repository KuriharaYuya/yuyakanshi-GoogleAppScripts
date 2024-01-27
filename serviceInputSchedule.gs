function getScheduleInputRange() {

  // B列において初めて"priority"という単語があるセルを特定
  const priorityColumn = 2; // B列
  let priorityRow;
  let endRow;
  let endTimeColumn;

  // B列を下にスキャンして、"priority"と"end"を見つける
  for (let i = 1; i <= shD.getLastRow(); i++) {
    const cellValue = shD.getRange(i, priorityColumn).getValue();
    if (cellValue === "priority" && !priorityRow) {
      priorityRow = i;
    } else if (cellValue === "end" && priorityRow && !endRow) {
      endRow = i;
    }
  }

  // "priority"がある行において右側にセルを探索し、"終了時刻"という文字があるセルを特定
  if (priorityRow) {
    for (let j = priorityColumn; j <= shD.getLastColumn(); j++) {
      const cellValue = shD.getRange(priorityRow, j).getValue();
      if (cellValue === "終了時刻") {
        endTimeColumn = j;
        break;
      }
    }
  }

  // 開始行、開始列、行数、列数を配列に格納
  const rangeParams = [
      priorityRow + 1, 
      priorityColumn, 
      endRow - priorityRow, 
      endTimeColumn - priorityColumn + 1
    ];
    Logger.log(rangeParams);
  if (priorityRow && endRow && endTimeColumn) {

    // 配列を使用して範囲を取得
    const range = shD.getRange(rangeParams[0], rangeParams[1], rangeParams[2], rangeParams[3]);

    return range;
  } else {

    throw new Error("必要なセルが見つかりませんでした。");
  }
}


function inputScheduleToSheet(r, tasks, backlogTaskHash) {
  const sheet = r.getSheet();
  const startRow = r.getRow();
  Logger.log("in inputScheduleToSheet")
  Logger.log(tasks)

  tasks.forEach((task, index) => {
    const row = startRow + index;
    let doneValue = "FALSE";
    let timeBlock = "予定"

    // backlogTaskHash配列をループして対応するタスクを探す
    for (const taskInHash of backlogTaskHash) {
      if (taskInHash.name === task.name && taskInHash.done === "TRUE") {
        doneValue = "TRUE";
      if (taskInHash.timeBlock !== "")
        timeBlock = taskInHash.timeBlock
      }
    }

    let consuming = task.consuming > 0 ?  task.consuming: task.duration;
    sheet.getRange(row, 2).setValue(task.priority); // B列に優先度
    sheet.getRange(row, 3).setValue(timeBlock); // C列にタイムブロック
    sheet.getRange(row, 4).setValue(task.name);    // C列にタスク名
    sheet.getRange(row, 9).setValue(doneValue);    // H列に完了ステータス
    sheet.getRange(row, 10).setValue(task.asp);     // I列にASP
    sheet.getRange(row, 11).setValue(consuming); // J列に所要時間
    sheet.getRange(row, 13).setValue(task.startTime); // L列に開始時刻
    sheet.getRange(row, 14).setValue(task.endTime);   // M列に終了時刻
  });
}






function extractTasksFromSchedule(scheduleBuf, existingTasks) {
  // existingTasksがnullまたはundefinedの場合、空のセットを作成
  const existingNames = existingTasks 
    ? new Set(existingTasks.map(task => task.name))
    : new Set();

  const extractedTasks = scheduleBuf.map(event => {
    const eventName = event.title;
    const matches = eventName.match(/^#(\w)(\d+):(.+)$/);

    // イベントの開始時刻と終了時刻を取得
    const startTime = event.startTime;
    const endTime = event.endTime;
    const duration = (endTime - startTime) / (60 * 1000); // 所要時間を分で計算

    if (matches) {
      // appointment
      const priority = matches[1]; // 優先度は1文字
      const asp = parseInt(matches[2], 10);
      const name = matches[3];

      // 既に存在するタスク名の場合はスキップ
      if (existingNames.has(name)) {
        return null;
      }

      return {
        priority: priority,
        asp: asp,
        name: name,
        duration: duration,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime)
      };
    } else {
      // task
      // 既に存在するタスク名の場合はスキップ
      if (existingNames.has(eventName)) {
        return null;
      }

      return {
        priority: "予定", // 優先度を "予定" とする
        asp: duration,          // ASPは空欄
        name: eventName,  // イベント名をそのまま使用
        duration: duration,     // 所要時間はカレンダーを反映させる
        startTime: formatTime(startTime),
        endTime: formatTime(endTime)
      };
    }
  }).filter(task => task !== null); // nullをフィルタリング

  return extractedTasks;
}



function getEmptyAreaInBacklog(backlogRange, emptyTaskIds) {
  // brの形式: [開始行, 開始列, 行数, 列数]
  // etは空のタスクIDの配列

  // brを使ってbacklogの全範囲を決定
  const startRow = backlogRange[0];
  const rowCount = backlogRange[2];

  // 空いている行のリストを作成
  let emptyRows = [];

  // etに含まれる各タスクIDについて、その行がbacklog範囲内で空いているかを確認
  for (let taskId of emptyTaskIds) {
    let taskRow = startRow + taskId - 1; // タスクIDを行数に変換
    if (taskRow >= startRow && taskRow < startRow + rowCount) {
      emptyRows.push(taskRow);
    }
  }

  // 配列の最後の要素を取り除く
  if (emptyRows.length > 0) {
    emptyRows.pop();
  }

  // 空いている行のリストを返す
  return emptyRows;
}

function inputAppointToBacklog(eaColumns, at) {
  // eaColumnsは空いているバックログの行番号の配列
  // atはバックログのハッシュフィルタを通過したタスクの配列

  // D列から順に time-block, priority, Name, 予想所要時間, A:所要時間をセットする
  const timeBlockColumn = 4;  // D列
  const priorityColumn = 5;   // E列
  const nameColumn = 6;       // F列
  const aspColumn = 11;  // J列

  // 空いているバックログの行にタスクをセットする
  for (let i = 0; i < eaColumns.length; i++) {
    if (i < at.length) {
      const row = eaColumns[i];  // 空いている行
      const task = at[i];  // セットするタスク

      Logger.log(task)

      // 各列にタスクの情報をセット
      shD.getRange(row, timeBlockColumn).setValue("未設定"); // time-block
      shD.getRange(row, priorityColumn).setValue(task.priority);   // priority
      shD.getRange(row, nameColumn).setValue(task.name);           // Name
      shD.getRange(row, aspColumn).setValue(task.asp); // 予想所要時間

      // 他の必要な情報があればここに追加
    }
  }
}