function getTodaySchedule() {

  // カレンダーのイベントの期間を指定
  const timeZero = " 00:00:00";
  const startDate = sp.getName();
  const startTime = new Date(startDate + timeZero);
  const endTime = new Date(startTime.getTime() + (24 * 60 * 60 * 1000));
  const events = calendar.getEvents(startTime, endTime);

  // イベントの情報を含む配列を返す
  return events.map(event => {
    return {
      title: event.getTitle(),
      startTime: event.getStartTime(),
      endTime: event.getEndTime()
    };
  });
}
