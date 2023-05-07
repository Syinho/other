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
                redirect: '/manage/student/viewscore',
                children: [
                    {
                        path: 'viewscore',
                        component: () => import('@/views/ViewScoreView/ViewScoreView.vue'),
                    },
                    {
                        path: 'viewdetailscore',
                        name: 'viewDetailScore',
                        props: true,
                        component: () => import('@/views/ViewDetailScore/ViewDetailScore.vue'),
                    },
                ],
            },
            // 管理员管理页面
            {
                path: 'admin',
                redirect: '/manage/admin/tasklist',
                children: [
                    // 体测任务列表
                    {
                        path: 'tasklist',
                        component: () => import('@/views/TaskListView/TaskListView.vue'),
                    },
                    // 查看指定体侧任务详情
                    {
                        path: 'viewtask/:id',
                        component: () => import('@/views/viewTaskView/viewTaskView.vue'),
                    },
                    {
                        path: 'usermanage',
                        redirect: '/manage/admin/teachermanage',
                    },
                    // 学生管理页面
                    {
                        path: 'studentmanage',
                        component: () => import('@/views/StusManage/StusManage.vue'),
                    },
                    // 教师管理页面
                    {
                        path: 'teachermanage',
                        component: () => import('@/views/TeacherManage/TeacherManage.vue'),
                    },
                    // 添加任务
                    {
                        path: 'addtask',
                        component: () => import('@/views/AddTaskView/AddTaskView.vue'),
                    },
                    {
                        path: 'addTask1',
                        component: () => import('@/views/AddTaskView1/AddTaskView1.vue'),
                        children: [
                            {
                                path: ':pk',
                                component: () => import('@/views/AddTaskView1/AddTaskView1.vue'),
                            },
                        ],
                    },
                    // 添加教师
                    {
                        path: 'addteacher',
                        component: () => import('@/views/AddTeacherView/AddTeacherView.vue'),
                    },
                ],
            },
            // 教师管理页面
            {
                path: 'teacher',
                redircet: '/manage/teacher/tasklist',
                children: [
                    // 体测任务列表
                    {
                        path: 'tasklist',
                        component: () => import('@/views/TaskListView/TaskListView.vue'),
                    },
                    // 录入成绩
                    {
                        path: 'logscore/:pk',
                        component: () => import('@/views/LogScoreView/LogScoreView.vue'),
                    },
                ],
            },
            // 修改密码
            {
                path: 'modifypwd',
                component: () => import('@/views/ModifyPWDView/ModifyPWDView.vue'),
            },
            // 评分标准
            {
                path: 'scoringstandard',
                name: 'scoringStandard',
                component: () => import('@/views/ScoringStandardView/ScoringStandardView.vue'),
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
