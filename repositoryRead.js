


function getTodaySchedule() {

  // カレンダーのイベントの期間を指定
  const timeZero = " 00:00:00";
  const startDate = sp.getName();
  const startTime = new Date(startDate + timeZero);
  const endTime = new Date(startTime.getTime() + (24 * 60 * 60 * 1000));
  const events = calendar.getEvents(startTime, endTime);


  // イベント情報とGoogle Calendar APIのイベントオブジェクトを含むハッシュ形式で返す
  return events.map(event => {
    return {
      title: event.getTitle(),
      startTime: event.getStartTime(),
      endTime: event.getEndTime(),
      rawEvent: event // Google Calendar API のイベントオブジェクト
    };
  });
}



function getBackLogTaskRangeBuf () {
  // ====== <start> mutable variables  ====

  const startRow = 2; // B列に"A: added C"は存在する
  let startColumn = 1; // "A:added C"が見つかったセルの列番号
  let endColumn = 1;   // "end"が見つかったセルの列番号
  let completeColumn = 1; // "完了"が見つかったセルの列番号

  // ====== <end> mutable variables  ====


  // startColumn と endColumn の値を設定
  for (var r = startRow; r <= shD.getLastRow(); r++) {
    const cellValue = shD.getRange(r, startRow).getValue(); // 行番号、列番号を使用して範囲を指定

    if (cellValue === "A:added C" && startColumn === 1) {
      startColumn = r;
      Logger.log("in getBackLogTaskRangeBuf");
      Logger.log("startColumn: " + startColumn);
    }
    if (cellValue === "end" && endColumn === 1) {
      endColumn = r;
      Logger.log("in getBackLogTaskRangeBuf");
      Logger.log("endColumn: " + endColumn);
    }
  }

  // set completeColumn
  // startColumnと同じ行で列を探索し、"完了"の文字がある列を特定
  for (var i = 1; i <= shD.getLastColumn(); i++) {
    if (shD.getRange(startColumn, i).getValue() === "完了") {
      completeColumn = i;
      break;
    }
  }

  // getRange(開始行, 開始列, 行数, 列数)で範囲を取得
  const range = [startColumn + 1, 2, endColumn - startColumn, completeColumn - 1];
  Logger.log("in getBackLogTaskRangeBuf");
  Logger.log("backlogArea==" + "開始行: " + range[0] + ", 開始列: " + range[1] + ", 行数: " + range[2] + ", 列数: " + range[3]);
  const buf = shD.getRange(range[0], range[1], range[2], range[3]).getValues();

  const hash = serializeBacklogBufToHash(buf)
  return {hash: hash,range: range}
}





// =========== start utils ==========

// =========== end utils ==========
function addSpdToCalender() {
  // 1 スプレッドシートを読み込む
  const sp = SpreadsheetApp.getActiveSpreadsheet();
  const sh1 = sp.getSheetByName('日報シート');

  // C列においてC1から数えて一番最初に"タスク","以上"という文字列があるセルを検索
  let firstTaskCellIndex = 1; // タスクが見つかったセルのインデックスを格納する変数
  let izyou = 1;
  for (var c = 1; c < 50; c++) {
    if (sh1.getRange('c' + c).getValue() === "タスク" && firstTaskCellIndex === 1) {
      firstTaskCellIndex = c;
      Logger.log("最初のタスクが見つかったセルのインデックス: " + firstTaskCellIndex);
    }
    if (sh1.getRange('c' + c).getValue() === "以上" && izyou === 1) {
      izyou = c;
      Logger.log("最初の以上が見つかったセルのインデックス: " + izyou);
    }
  }

  // タスクをbufferへ
  const contents = sh1.getRange(firstTaskCellIndex + 1, 3, izyou - firstTaskCellIndex - 1, 8).getValues(); // H列まで取得

  // カレンダーの設定
  let calendar = CalendarApp.getDefaultCalendar();

  // 日付を設定
  const tgtDate = sp.getName();
  
  // シートのフォルダタイトルから日付を取得
  const sheetDate = new Date(tgtDate);
  
  // startBaseは午前10時
  const startBase = new Date(sheetDate);
  startBase.setHours(10, 0, 0, 0); // 午前10時に設定
  
  // カレンダーから既存の予定を取得
  const existingEvents = calendar.getEvents(startBase, new Date(startBase.getTime() + 24 * 60 * 60 * 1000)); // 24時間分取得
  
  Logger.log(contents.length); // "length" の誤りを "length" に修正
  for (var i in contents) {
    const c = contents[i][0]; // 2次元配列から値を取り出す
    const title = c;
    const expectedMinutes = contents[i][5] || 60; // H列から見込み時間を取得（15の倍数でない場合は1時間とする）
    
    // 重複を確認してから追加
    if (!checkDuplicate(existingEvents, title)) {
      // startBaseよりi * 1時間追加
      const start = new Date(startBase.getTime() + i * 60 * 60 * 1000); // 1時間ごとに追加
    
      // endを見込み時間分追加
      const end = new Date(start.getTime() + expectedMinutes * 60 * 1000); // 開始時間から見込み時間分後

      // カレンダーに追加
      if (title == "") {
        continue
      }
      calendar.createEvent(title, start, end);
    } else {
      Logger.log("重複したイベントが存在します。スキップします。");
    }
  }
}

function checkDuplicate(existingEvents, title) {
  // 既存の予定とタイトルが一致するものがあれば重複と判定
  return existingEvents.some(event => event.getTitle() === title);
}



// 重複を確認する関数 (タイトルだけで確認)
function checkDuplicate(existingEvents, title) {
  for (var i in existingEvents) {
    const event = existingEvents[i];
    if (event.getTitle() === title) {
      return true;
    }
  }
  return false;
}






function callender() {
  // 1 スプレッドシートを読み込む
  const sp = SpreadsheetApp.getActiveSpreadsheet();
  const sh1 = sp.getSheetByName('日報シート');

  // 2 カレンダーをIDで読み込む
  const cal = CalendarApp.getCalendarById('yuya.kurihara@poni3.co.jp');

  // 3 カレンダーのイベントの期間を指定
  const timeZero = " 00:00:00";
  const startDate = sp.getName();
  const startTime = new Date(startDate + timeZero);
  const endTime = new Date(startTime.getTime() + (24 * 60 * 60 * 1000)); // startTimeの24時間後
  const event = cal.getEvents(startTime, endTime);

  // 4 イベントをスプレッドシートへ書き出す
  let firstTaskCellIndex = 1; // タスクが見つかったセルのインデックスを格納する変数

  // B列においてB1から数えて一番最初に"タスク"という文字列があるセルを検索
  for (var c = 1; c < 50; c++) {
    if (sh1.getRange('c' + c).getValue() === "タスク名" && firstTaskCellIndex === 1) {
      firstTaskCellIndex = c;
      Logger.log("最初のタスクが見つかったセルのインデックス: " + firstTaskCellIndex);
    }
  }

  // 4 イベントをスプレッドシートへ書き出す
  for (var i = 1; i < event.length + 1; i++) {
    const eventStartTime = event[i - 1].getStartTime();
    const eventEndTime = event[i - 1].getEndTime();
    const tgtCel = i + firstTaskCellIndex;

    sh1.getRange('c' + tgtCel).setValue(event[i - 1].getTitle());          // イベントタイトル
    sh1.getRange('g' + tgtCel).setValue(formatTime(eventStartTime));      // イベント開始時刻
    sh1.getRange('h' + tgtCel).setValue(formatTime(eventEndTime));        // イベント終了時刻

    const durationInMinutes = Math.round((eventEndTime - eventStartTime) / (60 * 1000));
    console.log(durationInMinutes)
    sh1.getRange('f' + tgtCel).setValue(durationInMinutes); // 所要時間（分）
  }
}

// 時刻のフォーマットを行う関数
function formatTime(date) {
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  return hours + ':' + minutes;
}

function calenderResult () {
    // 1 スプレッドシートを読み込む
  const sp = SpreadsheetApp.getActiveSpreadsheet();
  const sh1 = sp.getSheetByName('日報シート');

  // 2 カレンダーをIDで読み込む
  const cal = CalendarApp.getCalendarById('yuya.kurihara@poni3.co.jp');

  // 3 カレンダーのイベントの期間を指定
  const timeZero = " 00:00:00";
  const startDate = sp.getName();
  const startTime = new Date(startDate + timeZero);
  const endTime = new Date(startTime.getTime() + (24 * 60 * 60 * 1000)); // startTimeの24時間後
  const event = cal.getEvents(startTime, endTime);

  // 4 イベントをスプレッドシートへ書き出す
  let firstTaskCellIndex = 1; // タスクが見つかったセルのインデックスを格納する変数

  // B列においてB1から数えて一番最初に"タスク"という文字列があるセルを検索
  for (var c = 1; c < 50; c++) {
    if (sh1.getRange('c' + c).getValue() === "タスク名" && firstTaskCellIndex === 1) {
      firstTaskCellIndex = c;
      Logger.log("最初のタスクが見つかったセルのインデックス: " + firstTaskCellIndex);
    }
  }

  // 4 イベントをスプレッドシートへ書き出す
  for (var i = 1; i < event.length + 1; i++) {
    const eventStartTime = event[i - 1].getStartTime();
    const eventEndTime = event[i - 1].getEndTime();
    const tgtCel = i + firstTaskCellIndex;

    sh1.getRange('j' + tgtCel).setValue(event[i - 1].getTitle());          // イベントタイトル
    sh1.getRange('p' + tgtCel).setValue(formatTime(eventStartTime));      // イベント開始時刻
    sh1.getRange('q' + tgtCel).setValue(formatTime(eventEndTime));        // イベント終了時刻

    const durationInMinutes = Math.round((eventEndTime - eventStartTime) / (60 * 1000));
    console.log(durationInMinutes)
    sh1.getRange('o' + tgtCel).setValue(durationInMinutes); // 所要時間（分）
  }
}
