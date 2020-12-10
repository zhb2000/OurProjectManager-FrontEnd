//Vue Router 路由配置

import Vue from 'vue';
import VueRouter from 'vue-router';
import { JWT_TOKEN_KEY } from '../utils/ApiUtils';
import HomeDemo from '../views/HomeDemo.vue';
import MyHome from '../views/MyHome.vue';
import DevPanel from '../views/DevPanel.vue';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import UserHome from '../views/UserHome.vue';
import UserOverview from '../views/UserOverview.vue';
import UserProject from '../views/UserProject.vue';
import UserNotification from '../views/UserNotification.vue';
import UserSetting from '../views/UserSetting.vue';
import ProjectHome from '../views/ProjectHome.vue';
import ProjectOverview from '../views/ProjectOverview.vue';
import ProjectTask from '../views/ProjectTask.vue';
import ProjectMember from '../views/ProjectMember.vue';
import ProjectInvitation from '../views/ProjectInvitation.vue';
import ProjectSetting from '../views/ProjectSetting.vue';
import ProjectCreateTask from '../views/ProjectCreateTask.vue';
import ProjectViewTask from '../views/ProjectViewTask.vue';
import CreateProject from '../views/CreateProject.vue';
import JumpTo from '../views/JumpTo.vue';

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
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
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
