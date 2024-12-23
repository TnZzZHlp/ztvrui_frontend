<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Network {
  id: number
  name: string
}

const networks = ref<Network[]>([])

onMounted(() => {

  const temp = []

  fetch('/ztapi/controller/network', { mode: 'no-cors' })
    .then(response => response.json())
    .then(data => {
      data.forEach((element: string) => {
        fetch('/ztapi/controller/network/' + element, { mode: 'no-cors' })
          .then(response => response.json())
          .then(data => {
            networks.value.push({
              id: data.id,
              name: data.name
            })
          })
          .catch(error => {
            console.error('There was an error!', error)
          })
      })
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
})

</script>

<template>
  <div class="cards">
    <v-card :title="network.name" :subtitle=network.id v-for="network in networks" :key="network.id"
      :to="{ name: 'network', params: { id: network.id } }">
      <!-- <v-card-actions>
        <v-btn>Click me</v-btn>
      </v-card-actions> -->
    </v-card>
  </div>
</template>

<style>
.cards {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
}

.cards>* {
  flex: 1 1 200px;
  height: 200px;
  margin: 10px;
}
</style>
