import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'

import NetworksComponent from '@/components/HomeComponents/Networks.vue'
import NetworkComponent from '@/components/HomeComponents/Network.vue'
import UserManageComponent from '@/components/HomeComponents/UserManage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'networks',
          component: NetworksComponent,
        },
        {
          path: 'network/:id',
          name: 'network',
          component: NetworkComponent,
        },
        {
          path: 'user_manage',
          name: 'user_manage',
          component: UserManageComponent,
        },
      ],
    },
  ],
})

export default router
