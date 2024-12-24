<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const network_id = ref(useRoute().params.id)

import { shallowRef } from 'vue'

const tab = shallowRef('tab-1')
const tabs = [
  {
    icon: 'book-open-page-variant',
    text: 'Readme',
    value: 'tab-1',
  },
  {
    icon: 'handshake-outline',
    text: 'Code of Conduct',
    value: 'tab-2',
  },
  {
    icon: 'license',
    text: 'MIT License',
    value: 'tab-3',
  },
  {
    icon: 'shield-lock-outline',
    text: 'Security',
    value: 'tab-4',
  },
]

</script>

<template>
  <v-sheet color="#0d1117" elevation="3" rounded="lg">
    <v-tabs v-model="tab" :items="tabs" align-tabs="center" color="white" height="60" slider-color="#f78166">
      <template v-slot:tab="{ item }">
        <v-tab :text="item.text" :value="item.value" class="text-none"></v-tab>
      </template>

      <template v-slot:item="{ item }">
        <v-tabs-window-item :value="item.value" class="pa-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore
          voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde
          voluptatem!
        </v-tabs-window-item>
      </template>
    </v-tabs>
  </v-sheet>
</template>

<style></style>
