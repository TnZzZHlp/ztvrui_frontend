import { createRouter, createWebHistory } from 'vue-router'
// import LoginView from '../views/LoginView.vue'
// import HomeView from '../views/HomeView.vue'

// import NetworksComponent from '@/components/HomeComponents/Networks.vue'
// import NetworkComponent from '@/components/HomeComponents/Network.vue'
// import UserManageComponent from '@/components/HomeComponents/UserManage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      children: [
        {
          path: '',
          name: 'networks',
          component: () => import('@/components/HomeComponents/Networks.vue'),
        },
        {
          path: 'network/:id',
          name: 'network',
          component: () => import('@/components/HomeComponents/Network.vue'),
        },
        {
          path: 'user_manage',
          name: 'user_manage',
          component: () => import('@/components/HomeComponents/UserManage.vue'),
        },
        {
          path: '*',
          redirect: '/',
        },
      ],
    },
  ],
})

export default router
