//Vue Router 路由配置

import Vue from 'vue';
import VueRouter from 'vue-router';
import { JWT_TOKEN_KEY } from '../utils/ApiUtils';
import { routerMode } from '../MyConfig';
const HomeDemo = () => import('../views/HomeDemo.vue');
const MyHome = () => import('../views/MyHome.vue');
const DevPanel = () => import('../views/DevPanel.vue');
const Login = () => import('../views/Login.vue');
const SignUp = () => import('../views/SignUp.vue');
const UserHome = () => import('../views/user/UserHome.vue');
const UserOverview = () => import('../views/user/UserOverview.vue');
const UserProject = () => import('../views/user/UserProject.vue');
const UserNotification = () => import('../views/user/UserNotification.vue');
const UserSetting = () => import('../views/user/UserSetting.vue');
const ProjectHome = () => import('../views/project/ProjectHome.vue');
const ProjectOverview = () => import('../views/project/ProjectOverview.vue');
const ProjectTask = () => import('../views/project/ProjectTask.vue');
const ProjectMember = () => import('../views/project/ProjectMember.vue');
const ProjectStatistic = () => import('../views/project/ProjectStatistic.vue');
const ProjectInvitation = () => import('../views/project/ProjectInvitation.vue');
const ProjectSetting = () => import('../views/project/ProjectSetting.vue');
const CreateTask = () => import('../views/project/CreateTask.vue');
const ViewTask = () => import('../views/project/ViewTask.vue');
const ViewInvitation = () => import('../views/ViewInvitation.vue');
const JumpTo = () => import('../views/JumpTo.vue');

Vue.use(VueRouter);

const routes = [
    {
        path: '/homedemo',
        name: 'HomeDemo',
        component: HomeDemo,
        meta: { requiresLogin: true }
    },
    {
        path: '/aboutdemo',
        name: 'AboutDemo',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutDemo.vue'),
        meta: { requiresLogin: true }
    },
    {
        path: '/myhome',
        name: 'MyHome',
        component: MyHome
    },
    {
        path: '/',
        redirect: '/login'
    },
    {   //开发调试
        path: '/dev',
        name: 'DevPanel',
        component: DevPanel
    },
    {   //登录
        path: '/login',
        name: 'Login',
        component: Login
    },
    {   //注册
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {   //跳转到
        path: '/jump-to',
        name: 'JumpTo',
        component: JumpTo,
        meta: { requiresLogin: true }
    },
    {   //用户主页
        path: '/users/:username',
        name: 'UserHome',
        component: UserHome,
        redirect: '/users/:username/overview',
        meta: { requiresLogin: true },
        children: [
            {   //概览
                path: 'overview',
                name: 'UserOverview',
                component: UserOverview
            },
            {   //项目
                path: 'projects',
                name: 'UserProject',
                component: UserProject
            },
            {   //通知
                path: 'notifications',
                name: 'UserNotification',
                component: UserNotification
            },
            {   //设置
                path: 'setting',
                name: 'UserSetting',
                component: UserSetting
            }
        ]
    },
    {   //项目主页
        path: '/projects/:projectId',
        name: 'ProjectHome',
        component: ProjectHome,
        redirect: '/projects/:projectId/overview',
        meta: { requiresLogin: true },
        children: [
            {   //概览
                path: 'overview',
                name: 'ProjectOverview',
                component: ProjectOverview
            },
            {   //任务
                path: 'tasks',
                name: 'ProjectTask',
                component: ProjectTask
            },
            {   //成员
                path: 'members',
                name: 'ProjectMember',
                component: ProjectMember
            },
            {   //统计
                path: 'statistic',
                name: 'ProjectStatistic',
                component: ProjectStatistic
            },
            {   //邀请
                path: 'invitations',
                name: 'ProjectInvitation',
                component: ProjectInvitation
            },
            {   //设置
                path: 'setting',
                name: 'ProjectSetting',
                component: ProjectSetting
            },
            {   //创建任务
                path: 'tasks/create',
                name: 'CreateTask',
                component: CreateTask
            },
            {   //任务详情
                path: 'tasks/:taskId',
                name: 'ViewTask',
                component: ViewTask
            }
        ]
    },
    {   //查看邀请详情
        path: '/projects/:projectId/invitations/:invitationId',
        name: 'ViewInvitation',
        component: ViewInvitation,
        meta: { requiresLogin: true }
    }
];

const router = new VueRouter({
    routes,
    mode: routerMode
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresLogin)) {
        if (!localStorage.getItem(JWT_TOKEN_KEY)) {
            next('/login'); //未登录自动跳转到 Login
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
