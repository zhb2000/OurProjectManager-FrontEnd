import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeDemo from '../views/HomeDemo.vue';
import MyHome from '../views/MyHome.vue';
import DevPanel from '../views/DevPanel.vue';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import CreateProject from '../views/CreateProject.vue';

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
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (!localStorage.getItem('JWT_TOKEN')) {
      next({ name: 'Login' }); //未登录自动跳转到 Login
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
