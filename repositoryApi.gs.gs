function sendGetRequest(url) {
      
      // リクエストオプションを設定
      var options = {
        'method': 'get'
      };
      
      // UrlFetchAppを使用してGETリクエストを送信
      var response = UrlFetchApp.fetch(url, options);
      
      // レスポンス本文を取得
      return response.getContentText();
}

function getJizaieUrlWithDate () {
  const dateTxt = getDateBySheetName()
  const param = "?date="
  return getEnv().jizaieScheduleCalenderApiEndPoint + param + dateTxt
}