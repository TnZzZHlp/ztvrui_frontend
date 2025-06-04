<script setup lang="ts">
import { showPopupPanel } from '@/utils/showPopupPanel'
</script>

<template>
  <button @click="showPopupPanel(() => {}, '？？？', 'warn')">Show Popup</button>
</template>
