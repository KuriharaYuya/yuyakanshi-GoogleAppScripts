function renameTask(task) {
  // priorityとaspを文字列に変換
  const priority = task.priority;
  const aspString = String(task.asp);

  // 新しい名前のフォーマット: "#[Priority][ASP]:[Name]"
  return `#${priority}${aspString}:${task.name}`;
}

function backlogHashFilter(attr, value, tasks) {
  // 指定された属性が連想配列の要素のキーに含まれているかチェック
  if (tasks.length > 0 && !(attr in tasks[0])) {
    throw new Error("指定された属性は連想配列に存在しません: " + attr);
  }

  // フィルタリング処理
  return tasks.filter(task => task[attr] === value);
}

function serializeBacklogBufToHash(buf) {
  // 結果を格納するための配列
  let tasks = [];
  const s = 1; // ステータスの列インデックス
  const t = 2; // 時間割の列のインデックス
  const p = 3; // 優先度の列インデックス
  const n = 4; // タスク名の列インデックス
  const a = 8; // ASPの列インデックス
  const c = 9; // 所要時間の列インデックス
  const d = 10; // 完了の列のインデックス
  let doneValue
  
  // bufの各行をループして連想配列に変換
  for (let i = 0; i < buf.length; i++) {
    let row = buf[i];
    let aspValue = row[a];
    doneValue = row[d] ? "TRUE" : "FALSE";
    let task = {
      "id": i+ 1, // backlogにおいて上から何個目のタスクなのか
      "stanby": row[s] || false,
      "timeBlock": row[t],
      "priority": row[p],             // 優先度
      "name": String(row[n]),                 // タスク名
      "asp": aspValue || 0,            // ASPが空なら0、そうでなければその値 
      "consuming": row[c],            // ASPが空なら0、そうでなければその値 
      "done": doneValue
    };
    if (task.name !== "") {
      tasks.push(task);
    }
  }

  Logger.log("serializeBacklogBufToHash");
  Logger.log(tasks);
  return tasks;
}