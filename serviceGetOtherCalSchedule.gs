function getJizaieSchedule() {
  const j = sendGetRequest(getJizaieUrlWithDate())
  return  convertJsonToObject(j)
}
