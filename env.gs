// =========== start global var ==========

const sp = SpreadsheetApp.getActiveSpreadsheet();
const shD = sp.getSheetByName('日報シート');

const poni3Calendar = CalendarApp.getCalendarById(getEnv().poni3CalenderId);
const workingScheduleCalender = CalendarApp.getCalendarById(getEnv().worikingScheduleCalenderId);
const jizaieScheduleCalender = CalendarApp.getCalendarById(getEnv().jizaieScheduleCalenderIdId);


// =========== end global var ==========