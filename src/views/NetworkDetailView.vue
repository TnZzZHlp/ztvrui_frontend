<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const siderBarItems = [
  {
    label: t('network.detail.overview'),
    name: 'networkOverview',
  },
  {
    label: t('network.detail.members'),
    name: 'networkMembers',
  },
  {
    label: t('network.detail.settings'),
    name: 'networkSettings',
  },
  {
    label: t('network.detail.rules'),
    name: 'networkRules',
  },
]
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="shadow h-[60px] bg-white">
      <div class="h-full flex items-center justify-between px-4">
        <span class="font-bold text-xl cursor-pointer" @click="router.push({ name: 'networks' })">{{
          t('network.default')
        }}</span>
        <span class="font-bold text-xl">{{ t('network.detail.default') }}</span>
      </div>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <section class="p-4 w-[250px] h-full overflow-y-auto shadow">
        <ol>
          <li
            class="mb-2 w-full h-10 rounded flex items-center justify-center pl-2 transition-all"
            v-for="(item, index) in siderBarItems"
            :key="index"
            :class="
              router.currentRoute.value.name === item.name
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                : 'bg-white text-black hover:bg-gray-100 active:bg-gray-200'
            "
          >
            <button class="w-full text-left" @click="router.push({ name: item.name })">
              {{ item.label }}
            </button>
          </li>
        </ol>
      </section>

      <!-- Main Content -->
      <main>
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>
