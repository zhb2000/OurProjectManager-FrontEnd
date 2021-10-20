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
const UserHome = () => import('../views/UserHome.vue');
const UserOverview = () => import('../views/UserOverview.vue');
const UserProject = () => import('../views/UserProject.vue');
const UserNotification = () => import('../views/UserNotification.vue');
const UserSetting = () => import('../views/UserSetting.vue');
const ProjectHome = () => import('../views/ProjectHome.vue');
const ProjectOverview = () => import('../views/ProjectOverview.vue');
const ProjectTask = () => import('../views/ProjectTask.vue');
const ProjectMember = () => import('../views/ProjectMember.vue');
const ProjectStatistic = () => import('../views/ProjectStatistic.vue');
const ProjectInvitation = () => import('../views/ProjectInvitation.vue');
const ProjectSetting = () => import('../views/ProjectSetting.vue');
const ProjectCreateTask = () => import('../views/ProjectCreateTask.vue');
const ProjectViewTask = () => import('../views/ProjectViewTask.vue');
const InvitationView = () => import('../views/InvitationView.vue');
const CreateProject = () => import('../views/CreateProject.vue');
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
    {
        path: '/dev',
        name: 'DevPanel',
        component: DevPanel
    },
    //登录页面
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    //注册页面
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    //创建项目页面
    {
        path: '/create-project',
        name: 'CreateProject',
        component: CreateProject,
        meta: { requiresLogin: true }
    },
    //跳转到页面
    {
        path: '/jump-to',
        name: 'JumpTo',
        component: JumpTo,
        meta: { requiresLogin: true }
    },
    //用户主页
    {
        path: '/users/:username',
        name: 'UserHome',
        component: UserHome,
        redirect: '/users/:username/overview',
        meta: { requiresLogin: true },
        children: [
            {
                path: 'overview',
                name: 'UserOverview',
                component: UserOverview
            },
            {
                path: 'projects',
                name: 'UserProject',
                component: UserProject
            },
            {
                path: 'notifications',
                name: 'UserNotification',
                component: UserNotification
            },
            {
                path: 'setting',
                name: 'UserSetting',
                component: UserSetting
            }
        ]
    },
    //项目主页
    {
        path: '/projects/:projectId',
        name: 'ProjectHome',
        component: ProjectHome,
        redirect: '/projects/:projectId/overview',
        meta: { requiresLogin: true },
        children: [
            {
                path: 'overview',
                name: 'ProjectOverview',
                component: ProjectOverview
            },
            {
                path: 'tasks',
                name: 'ProjectTask',
                component: ProjectTask
            },
            {
                path: 'members',
                name: 'ProjectMember',
                component: ProjectMember
            },
            {
                path: 'statistic',
                name: 'ProjectStatistic',
                component: ProjectStatistic
            },
            {
                path: 'invitations',
                name: 'ProjectInvitation',
                component: ProjectInvitation
            },
            {
                path: 'setting',
                name: 'ProjectSetting',
                component: ProjectSetting
            },
            {
                path: 'tasks/create',
                name: 'ProjectCreateTask',
                component: ProjectCreateTask
            },
            {
                path: 'tasks/:taskId',
                name: 'ProjectViewTask',
                component: ProjectViewTask
            }
        ]
    },
    //邀请查看页面
    {
        path: '/projects/:projectId/invitations/:invitationId',
        name: 'InvitationView',
        component: InvitationView,
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
