import { check } from '@/api/manage/check'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      // children: [
      //   {
      //     path: '',
      //     name: 'networks',
      //     component: () => import('@/components/HomeComponents/Networks.vue'),
      //   },
      //   {
      //     path: 'network/:id',
      //     name: 'network',
      //     component: () => import('@/components/HomeComponents/Network.vue'),
      //   },
      //   {
      //     path: 'user_manage',
      //     name: 'user_manage',
      //     component: () => import('@/components/HomeComponents/UserManage.vue'),
      //   },
      // ],
    },
  ],
})

router.beforeEach((to) => {
  // Check Cookie
  check()
    .then(() => {
      if (to.name === 'login') {
        router.push('/home')
      }
    })
    .catch(() => {
      if (to.name !== 'login') {
        router.push('/')
      }
    })
})

export default router
