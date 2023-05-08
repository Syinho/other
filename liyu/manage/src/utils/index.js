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

export const translate = {
    bmi: '身体质量指数',
    pulmonary: '肺活量',
    jump: '跳远',
    flexion: '坐位体前屈',
    run50: '50m',
    run800: '800m',
    run1000: '1000m',
    adbominal_curl: '仰卧起坐',
    pull_up: '引体向上',
    runlong:'800米/1000米',
    curlorup:'引体向上/仰卧起坐',
    end:'最终'
}
