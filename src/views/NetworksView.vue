<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NetworksComponent from '@/components/NetworkListComponent.vue'
const { t } = useI18n()
</script>

<template>
  <div class="max-h-screen">
    <header class="shadow h-[60px] xl:px-[30%]">
      <div class="h-full flex items-center justify-between px-4">
        <span class="font-bold text-xl">{{ t('network.default') }}</span>
        <div>
          <button class="">{{ t('network.add') }}</button>
          <button class="">{{ t('network.add') }}</button>
        </div>
      </div>
    </header>

    <main class="xl:px-[30%] h-full flex items-center flex-col justify-start p-4">
      <NetworksComponent />
    </main>
  </div>
</template>
