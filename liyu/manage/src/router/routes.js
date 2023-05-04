export default [
  // 登录页面
  {
    path: '/login_register',
    name: 'login_register',
    component: () => import('@/views/LoginView/LoginView.vue'),
  },
  // 管理页面
  {
    path: '/manage',
    name: 'manage',
    component: () => import('@/views/MainView/MainView.vue'),
    children: [
      // 学生管理页面
      {
        path: 'student',
        name: 'student',
        component: () => import('@/views/StudentView/StudentView.vue'),
      },
      // 管理员管理页面
      {
        path: 'admin',
        name: 'admin',
        redirect: '/manage/admin/tasklist',
        children: [
          // 体测任务
          {
            path: 'tasklist',
            name: 'taskList',
            component: () => import('@/views/TaskListView/TaskListView.vue'),
          },
          {
            path: 'usermanage',
            name: 'userManage',
            redirect: '/manage/admin/teachermanage',
          },
          // 学生管理页面
          {
            path: 'studentmanage',
            name: 'studentManage',
            component: () => import('@/views/StusManage/StusManage.vue'),
          },
          // 教师管理页面
          {
            path: 'teachermanage',
            name: 'teacherManage',
            component: () => import('@/views/TeacherManage/TeacherManage.vue'),
          },
          // 添加任务
          {
            path: 'addtask',
            name: 'addTask',
            component: () => import('@/views/AddTaskView/AddTaskView.vue'),
          },
          {
            path: 'addTask1',
            name: 'addTask1',
            component: () => import('@/views/AddTaskView1/AddTaskView1.vue'),
            children: [
              { path: ':pk', component: () => import('@/views/AddTaskView1/AddTaskView1.vue') },
            ],
          },
          // 添加教师
          {
            path: 'addteacher',
            name: 'addTeacher',
            component: () => import('@/views/AddTeacherView/AddTeacherView.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/blank',
    name: 'blank',
    component: () => import('@/views/Blank/Blank.vue'),
  },
  {
    path: '/',
    redirect: '/login_register',
  },
]
