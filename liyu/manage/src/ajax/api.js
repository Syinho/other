import { instance } from './index.js'

/* 1.登录页 */
// 1.1 登录请求
export const reqPostLogin = (uid, password) =>
  instance
    .post('/login', { data: { uid, password } })
    .then(response => response.data)
    .catch(err => err)

// 1.2 注册请求
export const reqPostRegister = (uid, name, password) =>
  instance
    .post('/register', { data: { uid, name, password } })
    .then(response => response.data)
    .catch(err => err)

/* 2.体测任务 */
// 2.1 获取全部的体测任务
export const reqGetTaskList = () =>
  instance
    .get('/tasklist')
    .then(response => response.data)
    .catch(err => err)

// 2.2 管理员_添加体测任务1_添加基本的体测任务
export const reqPostTask = (name, begin_time, end_time, half, year) =>
  instance
    .post('/task', {
      data: {
        name,
        begin_time,
        end_time,
        half,
        year,
      },
    })
    .then(response => response.data)
    .catch(err => err)
// 2.3 管理员_添加体测任务2_上传学生的基本信息
export const reqPostStusInfo = f =>
  instance({
    method: 'post',
    url: '/uploadstudentinfomation',
    data: f,
  })
    .then(response => response.data)
    .catch(err => err)

// 2.4 管理员_添加体测任务3_给教师上传学生名单
// 上传由教师pk值组成的数组
export const reqPostTeachers = (task_id, teachers) =>
  instance
    .post('/distributeteacher', { data: { task_id, teachers } })
    .then(response => response.data)
    .catch(err => err)
// 2.5 获取全部教师
export const reqGetAllTeachers = () =>
  instance
    .get('/teacher')
    .then(response => response.data)
    .catch(err => err)

// 2.6 查看体测任务
export const reqGetTask = task_id =>
  instance
    .get('/task', { params: { task_id } })
    .then(response => response.data)
    .catch(err => err)

// 2.7 查看任务完成情况

/* 3.教师账户管理 */
// 3.1 添加新的教师
export const reqPostNewTeacher = (uid, name) =>
  instance
    .post('/teacher', { data: { uid, name } })
    .then(response => response.data)
    .catch(err => err)

/* 4 教师页面 */
// 4.1 根据任务id与教师id获取学生数据

export const reqGetStusList = (teacher_id, task_id, page_num) =>
  instance
    .get('/studentfromtaskbyteacher', {
      params: { teacher_id, task_id, page_num: page_num ? page_num : 1 },
    })
    .then(response => response.data)
    .catch(err => err)

// 4.2 根据教师id获取到其负责的体测任务
export const reqGetTaskListByTeacherId = teacher_id =>
  instance('/taskbyteacher', {
    params: {
      teacher_id,
    },
  })
    .then(response => response.data)
    .catch(err => err)

// 4.3 教师录入学生成绩
export const reqPutStusScore = (task_id, teacher_id, score_list) =>
  instance
    .put('/studentfromtaskbyteacher', {
      data: {
        task_id,
        teacher_id,
        score_list,
      },
    })
    .then(response => response.data)
    .catch(err => err)
