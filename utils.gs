function alp() {
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