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

const translateTable = {
    height: '身高',
    weight: '体重',
    bmi_score: '身高/体重得分',
    curlorup_score: '仰卧起坐',
    end_score: '最终得分',
    flexion: '坐位体前屈',
    flexion_score: '坐位体前屈得分',
    jump: '跳远',
    jump_score: '跳远得分',
    left_eye: '左眼视力',
    pull_up: '引体向上',
    pulmonary: '肺活量',
    pulmonary_score: '肺活量得分',
    right_eye: '右眼视力',
    run50: '50m',
    run800: '800m',
    run1000: '1000m',
    run50_score: '50m得分',
    runlong_score: '800m/1000m得分',
}
export const translate = function (key) {
    return translateTable[key]
}
export const translateObj = [
    { name: '身高', value: 'height' },
    { name: '体重', value: 'weight' },
    { name: '身高/体重得分', value: 'bmi_score' },
    { name: '仰卧起坐', value: 'curlorup_score' },
    { name: '最终得分', value: 'end_score' },
    { name: '坐位体前屈', value: 'flexion' },
    { name: '坐位体前屈得分', value: 'flexion_score' },
    { name: '跳远', value: 'jump' },
    { name: '跳远得分', value: 'jump_score' },
    { name: '左眼视力', value: 'left_eye' },
    { name: '引体向上', value: 'pull_up' },
    { name: '肺活量', value: 'pulmonary' },
    { name: '肺活量得分', value: 'pulmonary_score' },
    { name: '右眼视力', value: 'right_eye' },
    { name: '50m', value: 'run50' },
    { name: '800m', value: 'run800' },
    { name: '1000m', value: 'run1000' },
    { name: '50m得分', value: 'run50_score' },
    { name: '800m/1000m得分', value: 'runlong_score' },
]

export const handle_time = function (time) {
    let m = Math.floor(Number(time) / 60)
    let s = Number(time) % 60
    return `${m}'${s}`
}

const reTable = {
    身高: 'height',
    体重: 'weight',
    '身高/体重得分': 'bmi_score',
    仰卧起坐: 'curlorup_score',
    最终得分: 'end_score',
    坐位体前屈: 'flexion',
    坐位体前屈得分: 'flexion_score',
    跳远: 'jump',
    跳远得分: 'jump_score',
    左眼视力: 'left_eye',
    引体向上: 'pull_up',
    肺活量: 'pulmonary',
    肺活量得分: 'pulmonary_score',
    右眼视力: 'right_eye',
    '50m': 'run50',
    '800m': 'run800',
    '1000m': 'run1000',
    '50m得分': 'run50_score',
    '800m/1000m得分': 'runlong_score',
}

export const reTranslate = function (key) {
    return reTable[key]
}
