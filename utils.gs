function alpToNum() {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  var alpObject = {};

  for (var i = 0; i < alphabet.length; i++) {
    // アルファベットの各文字に対応する数値を設定
    alpObject[alphabet.charAt(i)] = i + 1;
  }

  return alpObject;
}

function getCellAlp(row, column) {
  // アルファベットを配列で用意
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let columnAlphabet = "";

  while (column > 0) {
    // 0インデックスの調整とアルファベットへの変換
    column--;
    columnAlphabet = alphabet.charAt(column % 26) + columnAlphabet;
    column = Math.floor(column / 26);
  }

  // アルファベットと行番号を組み合わせて返す
  return columnAlphabet + row;

  // 使用例
  // const cellAddress = getCellAlp(2, 3); // "C2"
  // Logger.log(cellAddress); // 出力: "C2"
}

function convertJsonToObject(jsonString) {

  // JSON文字列をオブジェクトに変換
  return JSON.parse(jsonString);
}

function calculateTimeDifference(startTime, endTime) {
  // startTimeとendTimeから時間と分を分割
  var startParts = startTime.split(':');
  var endParts = endTime.split(':');

  // 時間と分をそれぞれ数値に変換
  var startHours = parseInt(startParts[0], 10);
  var startMinutes = parseInt(startParts[1], 10);
  var endHours = parseInt(endParts[0], 10);
  var endMinutes = parseInt(endParts[1], 10);

  // 総分を計算
  var startTotalMinutes = startHours * 60 + startMinutes;
  var endTotalMinutes = endHours * 60 + endMinutes;

  // 差分を計算
  var diffMinutes = endTotalMinutes - startTotalMinutes;

  return diffMinutes;
}


function getDateBySheetName () {
  return sp.getName();
}
