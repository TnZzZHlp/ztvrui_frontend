<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  network: Object,
})

const { network } = toRefs(props)

const emit = defineEmits(['showSnackBar'])

const routesHeaders = ref([
  { title: t('target'), key: 'target' },
  { title: t('via'), key: 'via' },
])

const ipAssignmentHeaders = ref([
  { title: t('ip_range_start'), key: 'ipRangeStart' },
  { title: t('ip_range_end'), key: 'ipRangeEnd' },
])

// Copy Network ID
const copyToClipboard = (content: string) => {
  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Unable to copy to clipboard', err)
    }
    document.body.removeChild(textArea)
  }
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(content)
  } else {
    unsecuredCopyToClipboard(content)
  }
  emit('showSnackBar', 'green', t('copied'))
}

// Edit network name
const editNetworkName = () => {
  fetch('/ztapi/controller/network/' + network.value.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: network.value.name,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      emit('showSnackBar', 'green', t('save_success'))
    })
    .catch((error) => {
      console.error('There was an error!', error)
    })
}

// const infoHeight = computed(() => {
//   // 计算属性，network-overview占据父元素15%的高
//   return '15%'
// })

// const routeHeight = computed(() => {
//   // 计算属性，network-route占据父元素30%的高
//   return '200px'
// })

// const ipAssignmentHeight = computed(() => {
//   // 计算属性，network-ip-assignment占据父元素30%的高
//   return '30%'
// })

// const dnsRulesHeight = computed(() => {
//   // 计算属性，dns-rules占据父元素25%的高
//   return '25%'
// })
</script>

<template>
  <!-- Info Part -->
  <v-card
    variant="tonal"
    style="margin-bottom: 10px"
    :style="{ height: infoHeight }"
    density="compact"
  >
    <template v-slot:title>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('network_name') }}</span>
        <v-btn icon="$settings" variant="plain" @click="console.log('123')" size="x-small"></v-btn>
      </div>
      <p>
        <v-text-field
          variant="underlined"
          v-model="network.name"
          append-icon="$save"
          @click:append="editNetworkName(network.name)"
          @keydown.enter="editNetworkName(network.name)"
        ></v-text-field>
      </p>
    </template>
    <template v-slot:subtitle>
      {{ $t('network_id') }}
      <v-btn variant="text" size="x-small" @click="copyToClipboard(network?.id)">
        <v-icon icon="$copy" />
        {{ network?.id }}
      </v-btn>
    </template>
  </v-card>

  <!-- Route Part -->
  <v-card
    variant="tonal"
    style="margin-bottom: 10px"
    id="network-route"
    :style="{ height: routeHeight }"
    density="compact"
    height="300px"
  >
    <template v-slot:subtitle>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('route') }}</span>
        <v-btn icon="$settings" variant="plain" @click="console.log('123')" size="x-small"></v-btn>
      </div>
    </template>
    <v-data-table-virtual
      :headers="routesHeaders"
      :items="network.routes"
      style="border-radius: 0"
      fixed-header
      density="compact"
    >
      <template v-slot:item.target="{ item }">
        {{ item.target }}
      </template>
      <template v-slot:item.via="{ item }">
        {{ item.via == null ? 'LAN' : item.via }}
      </template>
      <template v-slot:no-data>{{ $t('no_route_yet') }}</template>
    </v-data-table-virtual>
  </v-card>

  <!-- IP Assignment Part -->
  <v-card
    variant="tonal"
    style="margin-bottom: 10px"
    id="network-ip-assignment"
    :style="{ height: ipAssignmentHeight }"
    density="compact"
  >
    <template v-slot:subtitle>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('ip_assignment') }}</span>
        <v-btn icon="$settings" variant="plain" @click="console.log('123')" size="x-small"></v-btn>
      </div>
    </template>

    <v-data-table-virtual
      :headers="ipAssignmentHeaders"
      :items="network.ipAssignmentPools"
      style="border-radius: 0"
      fixed-header
      density="compact"
    >
      <template v-slot:item.target="{ item }">
        {{ item.ipRangeStart }}
      </template>
      <template v-slot:item.via="{ item }">
        {{ item.ipRangeEnd }}
      </template>
      <template v-slot:no-data>{{ $t('no_route_yet') }}</template>
    </v-data-table-virtual>
  </v-card>

  <v-row :style="{ height: dnsRulesHeight }">
    <v-col>
      <!-- DNS Part -->
      <v-card variant="tonal" style="margin-bottom: 20px" height="100%" density="compact">
        <template v-slot:subtitle>
          <div style="display: flex; justify-content: space-between">
            <span>DNS</span>
            <v-btn
              icon="$settings"
              variant="plain"
              @click="console.log('123')"
              size="x-small"
            ></v-btn>
          </div>
          <p>{{ $t('domain') }}</p>
          <p>{{ network?.dns?.domain }}</p>
        </template>

        <template v-slot:item>
          <v-chip v-for="server in network?.dns?.servers" size="small">{{ server }}</v-chip>
        </template>
      </v-card>
    </v-col>

    <v-col>
      <!-- Rules Part -->
      <v-card variant="tonal" style="margin-bottom: 20px" height="100%" density="compact">
        <template v-slot:subtitle>
          <div style="display: flex; justify-content: space-between">
            <span>{{ $t('rules') }}</span>
            <v-btn
              icon="$settings"
              variant="plain"
              @click="console.log('123')"
              size="x-small"
            ></v-btn>
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>
