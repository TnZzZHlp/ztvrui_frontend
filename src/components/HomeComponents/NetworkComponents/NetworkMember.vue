<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue'

const network_members = ref([])


onMounted(() => {
  fetch(`/ztapi/controller/network/` + network_id.value)
    .then(res => res.json())
    .then(data => {
      network.value = data

    }).catch(err => {
      console.error(err)
    })
})

</script>

<template>
  <v-virtual-scroll :items="items" height="300" item-height="50">
    <template v-slot:default="{ item }">
      <v-list-item>
        <template v-slot:prepend>
          <v-avatar :color="item.color" class="text-white" size="40">
            {{ item.initials }}
          </v-avatar>
        </template>

        <v-list-item-title>{{ item.fullName }}</v-list-item-title>

        <template v-slot:append>
          <v-btn size="small" variant="tonal">
            View User

            <v-icon color="orange-darken-4" end>
              mdi-open-in-new
            </v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>
