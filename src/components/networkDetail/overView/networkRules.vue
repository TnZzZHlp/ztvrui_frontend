<script setup lang="ts">
import { useRoute } from 'vue-router'
import { networksData } from '../networkDetailStorage'
import { computed } from 'vue'
import { showModifyDNS } from './popupPanel/showModifyDNS'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const networkData = computed(() => {
  return networksData.value.find((data) => data.id === (route.params.networkId as string))
})
</script>

<template>
  <!-- Network Rules -->
  <div v-if="networkData" class="p-4 shadow bg-white rounded-2lg">adwwad</div>
</template>
