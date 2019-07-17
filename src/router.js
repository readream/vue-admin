import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'name',
      component: resolve => import('./views/login/login.vue')
    },
    {
      path: '/index',
      name: 'index',
      component: resolve => import('./views/index/index.vue'),
      redirect: '/index/welcome',
      children: [
        {
          path: 'welcome',
          component: resolve => import('./views/welcome/welcome.vue')
        },
        {
          path: 'users',
          name: 'user',
          component: resolve => import('./views/user/user.vue')
        },
        {
          path: 'rights',
          name: 'rights',
          component: resolve => import('./views/grant/rights.vue')
        },
        {
          path: 'roles',
          name: 'roles',
          component: resolve => import('./views/grant/roles.vue')
        },
        {
          path: 'goods',
          name: 'goods',
          component: resolve => import('./views/good/goodList.vue')
        },
        {
          path: 'categories',
          name: 'categories',
          component: resolve => import('./views/good/category.vue')
        },
        {
          path: 'params',
          name: 'params',
          component: resolve => import('./views/good/params.vue')
        },
        {
          path: 'orders',
          name: 'orders',
          component: resolve => import('./views/order/order.vue')
        },

        {
          path: 'reports',
          name: 'reports',
          component: resolve => import('./views/data/report.vue')
        }
      ]
    }

  ]
})
