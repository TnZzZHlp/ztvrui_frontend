<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import OverView from '@/components/HomeComponents/NetworkComponents/OverView.vue'
import NetworkMember from '@/components/HomeComponents/NetworkComponents/NetworkMember.vue'

const network_id = ref(useRoute().params.id)

const snackBarShow = ref(false)
const snackBarStatus = ref('success')
const snackBarText = ref('')

const showSnackBar = (status: string, text: string) => {
  snackBarStatus.value = status
  snackBarText.value = text
  snackBarShow.value = true
}

// Request network member data
const network_members = ref([])
const getMembers = () => {
  fetch(`/ztapi/controller/network/` + network_id.value + `/member`)
    .then((res) => res.json())
    .then((data) => {
      Object.keys(data).forEach((member: string) => {
        fetch(`/ztapi/controller/network/` + network_id.value + `/member/` + member)
          .then((res) => res.json())
          .then((data) => {
            // Update the member data
            const index = network_members.value.findIndex((item) => item.id === data.id)

            if (index !== -1) {
              network_members.value[index] = data
            } else {
              network_members.value.push(data)
            }
          })
      })

      // Remove the member that is not in the data
      network_members.value = network_members.value.filter((item) => {
        return Object.keys(data).includes(item.id)
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

// Request network member detail data
const network_members_detail = ref([])
const getMembersDetail = () => {
  fetch(`/ztapi/peer`)
    .then((res) => res.json())
    .then((data) => {
      network_members_detail.value = data
    })
    .catch((err) => {
      console.error(err)
    })
}

// Get network data
const network = ref({})
const getNetwork = () => {
  fetch(`/ztapi/controller/network/` + network_id.value)
    .then((res) => res.json())
    .then((data) => {
      network.value = data
    })
    .catch((err) => {
      console.error(err)
    })
}

// Continuously refresh data
const refreshData = () => {
  getNetwork()
  getMembers()
  getMembersDetail()
}

onMounted(() => {
  getNetwork()
  getMembers()
  getMembersDetail()
})
</script>

<template>
  <v-sheet style="padding-left: 10%; padding-right: 10%">
    <v-container fluid>
      <v-row>
        <v-col cols="12" style="height: 100%">
          <OverView
            :network="network"
            :showSnackBar="showSnackBar"
            @show-snack-bar="showSnackBar"
            @refresh-data="refreshData"
          />
        </v-col>

        <v-col cols="12">
          <NetworkMember
            :network_members="network_members"
            :network_members_detail="network_members_detail"
            @show-snack-bar="showSnackBar"
            @refresh-data="refreshData"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
  <v-snackbar v-model="snackBarShow" timeout="2000" location="top" :color="snackBarStatus">
    {{ snackBarText }}
  </v-snackbar>
</template>

<style></style>
