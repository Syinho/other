import md5 from 'md5'
export const chkAuth = function (auth) {
  if (auth === md5(1)) {
    return 1
  } else if (auth === md5(2)) {
    return 2
  } else if (auth === md5(3)) {
    return 3
  } else {
    return 0
  }
}

export const handleTime = function (timeStamp) {
  if (String(timeStamp).length === 10) {
    timeStamp = Number(timeStamp) * 1000
  } else if (String(timeStamp).length === 13) {
    timeStamp = Number(timeStamp)
  } else {
    console.error('传入timeStamp不正确')
    return timeStamp
  }
  const time = new Date(timeStamp)
  const y = time.getFullYear(),
    mon = time.getMonth() + 1,
    d = time.getDate(),
    h = time.getHours(),
    min = time.getMinutes(),
    s = time.getSeconds()
  return `${y}-${handleSingleNum(mon)}-${handleSingleNum(d)} ${handleSingleNum(
    h
  )}:${handleSingleNum(min)}:${handleSingleNum(s)}`

  function handleSingleNum(num) {
    return String(num).padStart(2, '0')
  }
}
