<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const network_id = ref(useRoute().params.id)

const tab = ref(null)
</script>

<template>
  <v-sheet height="100%">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab :value="1">{{ $t('overview') }}</v-tab>
      <v-tab :value="2">{{ $t('network_member') }}</v-tab>
      <v-tab :value="3">{{ $t('setting') }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        1
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        2
      </v-tabs-window-item>

      <v-tabs-window-item :value="3">
        3
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<style></style>
