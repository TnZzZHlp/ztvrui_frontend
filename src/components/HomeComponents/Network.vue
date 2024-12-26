<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import OverView from '@/components/HomeComponents/NetworkComponents/OverView.vue'
import NetworkMember from '@/components/HomeComponents/NetworkComponents/NetworkMember.vue'

const network_id = ref(useRoute().params.id)

const tab = ref(null)

// Request network data
const network = ref({})

onMounted(() => {
  fetch(`/ztapi/controller/network/` + network_id.value)
    .then((res) => res.json())
    .then((data) => {
      network.value = data
    })
    .catch((err) => {
      console.error(err)
    })
})
</script>

<template>
  <v-sheet height="100%">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab :value="1">{{ $t('overview') }}</v-tab>
      <v-tab :value="2">{{ $t('network_member') }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <div style="padding: 10px">
          <OverView :network="network" />
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item :value="2">
        <div style="padding: 10px">
          <NetworkMember :network="network" />
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<style></style>
