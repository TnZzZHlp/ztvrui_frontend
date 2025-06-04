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
      path: '/networks',
      name: 'networks',
      component: () => import('@/views/NetworksView.vue'),
    },
    {
      path: '/network/:networkId',
      name: 'networkDetail',
      component: () => import('@/views/NetworkDetailView.vue'),
      children: [
        {
          path: 'overview',
          name: 'networkOverview',
          component: () => import('@/components/networkDetail/networkRulesComponent.vue'),
        },
        {
          path: 'members',
          name: 'networkMembers',
          component: () => import('@/components/networkDetail/networkMembersComponent.vue'),
        },
        {
          path: 'settings',
          name: 'networkSettings',
          component: () => import('@/components/networkDetail/networkSettingsComponent.vue'),
        },
        {
          path: 'rules',
          name: 'networkRules',
          component: () => import('@/components/networkDetail/networkRulesComponent.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  await check()
    .then(() => {
      if (to.name === 'login') {
        router.push({ name: 'networks' })
      }
    })
    .catch(() => {
      if (to.name !== 'login') {
        router.push({ name: 'login' })
      }
    })
})

export default router
