<script setup lang="ts">
import { toRefs, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const props = defineProps({
  network: Object,
})

const { network } = toRefs(props)
</script>

<template>
  <!-- Info Part -->
  <v-card variant="tonal" style="margin-bottom: 20px">
    <template v-slot:title>
      <p>{{ $t('network_name') }}</p>
      <p>
        <v-text-field
          variant="underlined"
          v-model="network.name"
          append-icon="$save"
          @click:append="editNetworkName(network.name)"
        ></v-text-field>
      </p>
    </template>
    <template v-slot:subtitle>
      {{ $t('network_id') }}
      <v-btn variant="text" size="small" @click="copyToClipboard(network?.id)">
        <v-icon icon="$copy" />
        {{ network?.id }}
      </v-btn>
    </template>
  </v-card>

  <!-- Route Part -->
  <v-card variant="tonal" style="margin-bottom: 20px">
    <template v-slot:title>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('route') }}</span>
        <v-btn icon="$settings" variant="plain" @click="console.log('123')"></v-btn>
      </div>
    </template>

    <v-data-table-virtual :headers="routesHeaders" :items="network.routes" style="padding: 10px">
      <template v-slot:item.target="{ item }">
        {{ item.target }}
      </template>
      <template v-slot:item.via="{ item }">
        {{ item.via }}
      </template>
      <template v-slot:no-data>{{ $t('no_route_yet') }}</template>
    </v-data-table-virtual>
  </v-card>

  <!-- IP Assignment Part -->
  <v-card variant="tonal" style="margin-bottom: 20px">
    <template v-slot:title>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('ip_assignment') }}</span>
        <v-btn icon="$settings" variant="plain" @click="console.log('123')"></v-btn>
      </div>
    </template>

    <v-data-table-virtual
      :headers="ipAssignmentHeaders"
      :items="network.ipAssignmentPools"
      style="padding: 10px"
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

  <!-- DNS Part -->
  <v-card variant="tonal" style="margin-bottom: 20px">
    <template v-slot:title>
      <div style="display: flex; justify-content: space-between">
        <span>DNS</span>
        <v-btn icon="$settings" variant="plain" @click="console.log('123')"></v-btn>
      </div>
    </template>
    <template v-slot:subtitle>
      <p>{{ $t('domain') }}</p>
      <p>{{ network?.dns?.domain }}</p>
    </template>

    <template v-slot:item>
      <v-chip v-for="server in network?.dns?.servers">{{ server }}</v-chip>
    </template>
  </v-card>
</template>
