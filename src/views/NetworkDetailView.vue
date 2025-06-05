<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import sideBarOpenIcon from '@/assets/icons/sidebar-open.svg'
import sideBarCloseIcon from '@/assets/icons/sidebar-close.svg'
import returnIcon from '@/assets/icons/return-back-button.svg'
import { getNetworkOverviewData } from '@/components/networkDetail/networkDetailStorage'

const { t } = useI18n()
const router = useRouter()
const showSiderBar = ref(window.innerWidth >= 1024)
const siderBarItems = [
  {
    label: t('network.detail.overview'),
    name: 'networkOverview',
    action: () => {
      router.push({ name: 'networkOverview' })
      showSiderBar.value = false
    },
  },
  {
    label: t('network.detail.members'),
    name: 'networkMembers',
    action: () => {
      router.push({ name: 'networkMembers' })
      showSiderBar.value = false
    },
  },
  {
    label: t('common.return'),
    icon: returnIcon,
    name: 'networks',
    action: () => {
      router.push({ name: 'networks' })
    },
  },
]

onBeforeMount(() => {
  console.log('NetworkDetailView mounted')
  getNetworkOverviewData(router.currentRoute.value.params.networkId as string)
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="shadow h-[60px] bg-white">
      <div class="h-full flex items-center justify-between px-4">
        <span class="font-bold text-xl cursor-pointer" @click="showSiderBar = !showSiderBar">
          <transition name="fade" mode="out-in">
            <img
              :key="showSiderBar ? 'open' : 'close'"
              :src="showSiderBar ? sideBarOpenIcon : sideBarCloseIcon"
              alt="Toggle Sidebar"
              class="inline-block mr-2"
            />
          </transition>
        </span>
        <span class="font-bold text-xl">{{ t('network.detail.default') }}</span>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden w-full">
      <!-- Sidebar -->
      <section
        class="h-full shadow transition-all duration-300 flex-none overflow-hidden"
        :class="showSiderBar ? 'lg:w-64 p-4 w-full' : 'w-0 p-0'"
      >
        <ol>
          <li
            class="mb-2 h-10 rounded flex items-center justify-center pl-2 transition-all"
            v-for="(item, index) in siderBarItems"
            :key="index"
            :class="{
              'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white':
                router.currentRoute.value.name === item.name,
              'bg-white hover:bg-gray-100 active:bg-gray-200':
                router.currentRoute.value.name !== item.name,
            }"
          >
            <img
              v-if="item.icon"
              :src="item.icon"
              alt="returnIcon"
              class="h-full w-auto object-contain"
            />
            <button class="w-full text-left text-nowrap" @click="item.action">
              {{ item.label }}
            </button>
          </li>
        </ol>
      </section>

      <!-- Main Content -->
      <main class="overflow-scroll w-full h-full">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
