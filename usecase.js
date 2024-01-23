function addStanbyTaskToCal () {
  // TODO 最初にrangeを取得するときにcolだけ取得して、それで取得しておく -> addedをtrueにする必要があるから

  // backlogの範囲をbufとして取得
  const res = getBackLogTaskRangeBuf()
  const buf = res.buf
  // [開始行, 開始列, 行数, 列数]
  const backlogRange = res.range

  // 連想配列に変換
  const hash = serializeBacklogBufToHash(buf);

  // カレンダーを読み込んでgetTodayScheduleByCalender()
  const scheduleBuf = getTodaySchedule()
  // stanbyとなっていて、かつカレンダーに追加されていないものを20時以降に順番にアサインする

  // backlogのhashからstanbyのものだけをフィルターする
  const stanbyTasks = backlogHashFilter("stanby", true, hash)

  // カレンダーにあるものとforで回して照合し、追加されていないものだけを返却する
  const tasksToAdd = stanbyTasks.filter(task => {
    // タスクがカレンダーの予定に含まれているかどうかをチェック
    return !scheduleBuf.some(event => event.title === task.name);
  });
  
  // 20時以降にアサインする
  // 20時の時刻オブジェクトを作成
  const eveningTime = new Date();
  eveningTime.setHours(20, 0, 0, 0);

  // タスクをカレンダーに追加
  for (let i = 0; i < tasksToAdd.length; i++) {
    const task = tasksToAdd[i];

    // イベントの開始時間と終了時間を設定（ここでは1時間とする）
    const title = task.name
    const start = new Date(eveningTime.getTime() + i * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1時間後
    Logger.log("タスクを追加: " + task.name + " 開始時間: " + start + " 終了時間: " + end);
    calendar.createEvent(title, start, end);

    // added to cをwriteする
    const id = parseInt(task.id, 10); // idを整数に変換
    const taskCol = parseInt(id + backlogRange[0] - 1, 10); // taskColを整数に変換
    const taskRow = parseInt(backlogRange[1], 10); // taskRowを整数に変換
    const tgtCellName = getCellAlp(taskCol, taskRow);

    const cell = shD.getRange(tgtCellName);
    cell.setValue("TRUE");
  }

  // todo
  
  // まずはgit連携を確実にやる
  // タスクの命名規則を反映させる。
  // あとはリファクタをちゃんと考えてやる。開発docをgithubでやる
}

function removeUnStanbyTaskToCal () {
  // backlogのbufを連想配列で取得
  // カレンダーを読み込み
  // unstanbyで、カレンダーに追加されているものを削除する
  // シートにあるものだけね
}

function inputCalenderResultsToSheet () {
  // カレンダーから予定を取得する
  // 命名規則から優先度を取得する
  // nameや所要時間なども取得
  // mtgの場合、

  // memo: 優先度はプルダウンではなく、条件付き書式に変更する
}