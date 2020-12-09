import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: {
                title: '自述文件'
            },
            children: [{
                    path: '/dashboard',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
                    meta: {
                        title: '系统首页',
                        requireAuth: true,
                        roles: [0, 1, 2]
                    },
                    // meta: {requireAuth: true, roles: ['admin','teacher','student']}
                },
                {
                    path: '/photograph',
                    component: () => import( /* webpackChunkName: "photograph" */ '../views/Photograph.vue'),
                    meta: {
                        title: '即时拍照',
                        requireAuth: true
                    }

                },
                {
                    path: '/table',
                    component: () => import( /* webpackChunkName: "table" */ '../views/BaseTable.vue'),
                    meta: {
                        title: '基础表格'
                    }
                },
                {
                    path: '/students',
                    component: () => import( /* webpackChunkName: "students" */ '../views/UsersManager/StuInfo.vue'),
                    meta: {
                        title: '学生信息管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/teachers',
                    component: () => import( /* webpackChunkName: "teachers" */ '../views/UsersManager/TeachersInfo.vue'),
                    meta: {
                        title: '教师信息管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/personInfo',
                    component: () => import( /* webpackChunkName: "personInfo" */ '../views/UsersManager/PersonInfo.vue'),
                    meta: {
                        title: '个人信息',
                        requireAuth: true
                    }
                },
                {
                    path: '/tabs',
                    component: () => import( /* webpackChunkName: "tabs" */ '../views/Tabs.vue'),
                    meta: {
                        title: 'tab选项卡',
                        requireAuth: true
                    }
                },
                {
                    path: '/form',
                    component: () => import( /* webpackChunkName: "form" */ '../views/BaseForm.vue'),
                    meta: {
                        title: '基本表单',
                        requireAuth: true
                    }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import( /* webpackChunkName: "editor" */ '../views/VueEditor.vue'),
                    meta: {
                        title: '富文本编辑器',
                        requireAuth: true
                    }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import( /* webpackChunkName: "markdown" */ '../views/Markdown.vue'),
                    meta: {
                        title: 'markdown编辑器',
                        requireAuth: true
                    }
                },
                {
                    // 图片上传组件
                    path: '/uploadFace',
                    component: () => import( /* webpackChunkName: "uploadFace" */ '../views/FaceManager/UploadFace.vue'),
                    meta: {
                        title: '添加人脸',
                        requireAuth: true
                    }
                },
                {
                    // 图片上传更新组件
                    path: '/updateFace',
                    component: () => import( /* webpackChunkName: "updateFace" */ '../views/FaceManager/UpdateFace.vue'),
                    meta: {
                        title: '更新人脸',
                        requireAuth: true
                    }
                },
                {
                    // 图片上传更新组件-学生
                    path: '/studentsFaces',
                    component: () => import( /* webpackChunkName: "studentsFaces" */ '../views/FaceManager/StudentsFaces.vue'),
                    meta: {
                        title: '学生人脸管理',
                        requireAuth: true
                    }
                },
                {
                    // 图片上传更新组件-教师
                    path: '/teachersFaces',
                    component: () => import( /* webpackChunkName: "teachersFaces" */ '../views/FaceManager/TeachersFaces.vue'),
                    meta: {
                        title: '教师人脸管理',
                        requireAuth: true
                    }
                },

                // {
                //     // 图片上传更新组件-其他用户
                //     path: '/adminsFaces',
                //     component: () => import(/* webpackChunkName: "adminsFaces" */ '../views/FaceManager/AdminsFaces.vue'),
                //     meta: { title: '管理员人脸管理' ,requireAuth: true}
                // },
                {
                    path: '/changePwd',
                    component: () => import( /* webpackChunkName: "changePwd" */ '../views/AccountSettings/ChangePwd.vue'),
                    meta: {
                        title: '修改账户密码',
                        requireAuth: true
                    }
                },
                {
                    path: '/changePwdN',
                    component: () => import( /* webpackChunkName: "changePwdN" */ '../views/AccountSettings/ChangePwdN.vue'),
                    meta: {
                        title: '修改密保问题',
                        requireAuth: true
                    }
                },
                {
                    path: '/accountStatus',
                    component: () => import( /* webpackChunkName: "accountStatus" */ '../views/AccountSettings/AccountStatus.vue'),
                    meta: {
                        title: '账户冻结',
                        requireAuth: true
                    }
                },
                {
                    path: '/resetPwd',
                    component: () => import( /* webpackChunkName: "resetPwd" */ '../views/AccountSettings/ResetPwd.vue'),
                    meta: {
                        title: '账户冻结'
                    }
                },

                {
                    path: '/courses',
                    component: () => import( /* webpackChunkName: "courses" */ '../views/ClassTable/Courses.vue'),
                    meta: {
                        title: '课程表'
                    }
                },
                {
                    path: '/addcourse',
                    component: () => import( /* webpackChunkName: "addcourse" */ '../views/ClassTable/AddCourse.vue'),
                    meta: {
                        title: '添加课程'
                    }
                },
                {
                    path: '/arrangeCourse',
                    component: () => import( /* webpackChunkName: "arrangeCourse" */ '../views/ClassTable/ArrangeCourse.vue'),
                    meta: {
                        title: '排课'
                    }
                },
                {
                    path: '/studenttable',
                    component: () => import( /* webpackChunkName: "studenttable" */ '../views/ClassTable/StudentTable.vue'),
                    meta: {
                        title: '选修情况'
                    }
                },
                {
                    path: '/signin',
                    component: () => import( /* webpackChunkName: "signin" */ '../views/SignIn/SignIn.vue'),
                    meta: {
                        title: '考勤'
                    }
                },
                {
                    path: '/attendenceRecords',
                    component: () => import( /* webpackChunkName: "attendenceRecords" */ '../views/SignIn/AttendenceRecords.vue'),
                    meta: {
                        title: '考勤记录'
                    }
                },
                {
                    path: '/attendenceCourse',
                    component: () => import( /* webpackChunkName: "attendenceCourse" */ '../views/SignIn/AttendenceCourse.vue'),
                    meta: {
                        title: '考勤课程'
                    }
                },
                {
                    path: '/attendenceQuery',
                    component: () => import( /* webpackChunkName: "attendenceQuery" */ '../views/SignIn/AttendenceQuery.vue'),
                    meta: {
                        title: '出勤率'
                    }
                },
                { 
                    path: '/stuAttendenceRecords',
                    component: () => import( /* webpackChunkName: "stuAttendenceRecords" */ '../views/SignIn/StuAttendenceRecords.vue'),
                    meta: {
                        title: '考勤记录'
                    } 
                },
                { 
                    path: '/teachAttendenceRecords',
                    component: () => import( /* webpackChunkName: "teachAttendenceRecords" */ '../views/SignIn/TeachAttendenceRecords.vue'),
                    meta: {
                        title: '考勤记录'
                    } 
                },
                {
                    path: '/attendenceInfo',
                    component: () => import( /* webpackChunkName: "attendenceInfo" */ '../views/SignIn/AttendenceInfo.vue'),
                    meta: {
                        title: '课程出勤率'
                    }
                },
                {
                    path: '/recentAttendence',
                    component: () => import( /* webpackChunkName: "RecentAttendence" */ '../views/SignIn/RecentAttendence.vue'),
                    meta: {
                        title: '课程签到情况'
                    }
                },
                { 
                    path: '/roseJude',
                    component: () => import( /* webpackChunkName: "roseJude" */ '../views/SignIn/RoseJude.vue'),
                    meta: {
                        title: '角色判断'
                    } 
                },
                {
                    path: '/webSocket',
                    component: () => import( /* webpackChunkName: "webSocket" */ '../views/WebSocket/WebSocket.vue'),
                    meta: {
                        title: 'WebSocket'
                    }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import( /* webpackChunkName: "chart" */ '../views/BaseCharts.vue'),
                    meta: {
                        title: 'schart图表',
                        requireAuth: true
                    }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import( /* webpackChunkName: "drag" */ '../views/DragList.vue'),
                    meta: {
                        title: '拖拽列表'
                    }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import( /* webpackChunkName: "dragdialog" */ '../views/DragDialog.vue'),
                    meta: {
                        title: '拖拽弹框'
                    }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import( /* webpackChunkName: "i18n" */ '../views/I18n.vue'),
                    meta: {
                        title: '国际化'
                    }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import( /* webpackChunkName: "permission" */ '../views/Permission.vue'),
                    meta: {
                        title: '权限测试',
                        permission: true
                    }
                },
                {
                    path: '/404',
                    component: () => import( /* webpackChunkName: "404" */ '../views/404.vue'),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: () => import( /* webpackChunkName: "403" */ '../views/403.vue'),
                    meta: {
                        title: '403'
                    }
                },
                {
                    path: '/donate',
                    component: () => import( /* webpackChunkName: "donate" */ '../views/Donate.vue'),
                    meta: {
                        title: '支持作者'
                    }
                }
            ]
        },
        {
            path: '/login',
            component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});