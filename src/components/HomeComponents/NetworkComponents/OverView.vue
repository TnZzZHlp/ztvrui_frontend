<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  network: Object,
})

const { network } = toRefs(props)

const emit = defineEmits(['showSnackBar', 'refreshData'])

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

/// Dialog
// Info Dialog
const infoDialog = ref(false)

const modifyNetworkInfo = () => {
  fetch('/ztapi/controller/network/' + network.value.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      enableBroadcast: network.value.enableBroadcast,
      private: network.value.private,
      mtu: network.value.mtu,
      multicastLimit: network.value.multicastLimit,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      emit('showSnackBar', 'green', t('save_success'))
      infoDialog.value = false
      emit('refreshData')
    })
    .catch((error) => {
      console.error('There was an error!', error)
    })
}

// Route Dialog
const routeDialog = ref(false)

const modifyRoute = () => {
  fetch('/ztapi/controller/network/' + network.value.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      routes: network.value.routes,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      emit('showSnackBar', 'green', t('save_success'))
      routeDialog.value = false
      emit('refreshData')
    })
    .catch((error) => {
      console.error('There was an error!', error)
    })
}

// IP Assignment Dialog
const ipAssignmentDialog = ref(false)

const modifyIpAssignment = () => {
  fetch('/ztapi/controller/network/' + network.value.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ipAssignmentPools: network.value.ipAssignmentPools,
      v4AssignMode: network.value.v4AssignMode,
      v6AssignMode: network.value.v6AssignMode,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      emit('showSnackBar', 'green', t('save_success'))
      ipAssignmentDialog.value = false
      emit('refreshData')
    })
    .catch((error) => {
      console.error('There was an error!', error)
    })
}

// DNS Dialog
const dnsDialog = ref(false)

const removeDns = () => {
  network.value.dns.domain = ''
  network.value.dns.servers = []
}

const modifyDns = () => {
  fetch('/ztapi/controller/network/' + network.value.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dns: network.value.dns,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      emit('showSnackBar', 'green', t('save_success'))
      dnsDialog.value = false
      emit('refreshData')
    })
    .catch((error) => {
      console.error('There was an error!', error)
    })
}
</script>

<template>
  <!-- Info Part -->
  <v-card variant="tonal" style="margin-bottom: 10px" density="compact">
    <template v-slot:title>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('network_name') }}</span>
        <v-btn icon="$settings" variant="plain" @click="infoDialog = true" size="x-small"></v-btn>
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

  <!-- Info Dialog -->
  <v-dialog max-width="500" v-model="infoDialog">
    <v-card :title="t('modify_network_info')">
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col>
                <v-checkbox
                  :label="t('enable_broadcast')"
                  v-model="network.enableBroadcast"
                  color="primary"
                ></v-checkbox>
                <v-checkbox
                  :label="t('network_type') + ' ' + (network.private ? t('private') : t('public'))"
                  v-model="network.private"
                  color="primary"
                ></v-checkbox>
                <v-text-field label="MTU" required v-model="network.mtu"></v-text-field>
                <v-text-field
                  :label="t('multicast_limit')"
                  required
                  v-model="network.multicastLimit"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn :text="t('cancel')" @click="infoDialog = false" variant="tonal"></v-btn>
        <v-btn
          :text="t('submit')"
          @click="modifyNetworkInfo"
          variant="tonal"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Route Part -->
  <v-card variant="tonal" style="margin-bottom: 10px" id="network-route" density="compact">
    <template v-slot:subtitle>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('route') }}</span>
        <v-btn icon="$settings" variant="plain" @click="routeDialog = true" size="x-small"></v-btn>
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

  <!-- Route Dialog -->
  <v-dialog v-model="routeDialog">
    <v-card>
      <v-card-title>
        <div style="display: flex; justify-content: space-between">
          <span>{{ $t('modify_route') }}</span>
          <v-btn
            icon="$add"
            variant="tonal"
            @click="network.routes.push({ target: '', via: null })"
          ></v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row v-for="(route, index) in network.routes" :key="index">
              <v-col>
                <v-text-field
                  :label="t('target')"
                  required
                  v-model="route.target"
                  variant="solo-filled"
                  append-inner-icon="$delete"
                  @click:append-inner="network.routes.splice(index, 1)"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  :label="t('via')"
                  required
                  v-model="route.via"
                  variant="solo-filled"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn :text="t('cancel')" @click="routeDialog = false" variant="tonal"></v-btn>
        <v-btn :text="t('submit')" @click="modifyRoute" variant="tonal" color="primary"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- IP Assignment Part -->
  <v-card variant="tonal" style="margin-bottom: 10px" id="network-ip-assignment" density="compact">
    <template v-slot:subtitle>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('ip_assignment') }}</span>
        <v-btn
          icon="$settings"
          variant="plain"
          @click="ipAssignmentDialog = true"
          size="x-small"
        ></v-btn>
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

  <!-- IP Assignment Dialog -->
  <v-dialog v-model="ipAssignmentDialog">
    <v-card>
      <v-card-title>
        <div style="display: flex; justify-content: space-between">
          <span>{{ $t('modify_ip_assignment_pool') }}</span>
          <v-btn
            icon="$add"
            variant="tonal"
            @click="network.ipAssignmentPools.push({ ipRangeStart: '', ipRangeEnd: '' })"
          ></v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-container>
            <v-checkbox
              :label="'IPV4' + t('enable_auto_assign_from_range')"
              v-model="network.v4AssignMode.zt"
            ></v-checkbox>
            <v-checkbox
              :label="'IPV6' + t('enable_auto_assign_from_range')"
              v-model="network.v6AssignMode.zt"
            ></v-checkbox>
            <v-checkbox
              :label="t('enable_6plane')"
              v-model="network.v6AssignMode['6plane']"
            ></v-checkbox>
            <v-checkbox
              :label="t('enable_rfc4193')"
              v-model="network.v6AssignMode.rfc4193"
            ></v-checkbox>
            <v-row v-for="(ipAssignment, index) in network.ipAssignmentPools" :key="index">
              <v-col>
                <v-text-field
                  :label="t('ip_range_start')"
                  required
                  v-model="ipAssignment.ipRangeStart"
                  variant="solo-filled"
                  append-inner-icon="$delete"
                  @click:append-inner="network.ipAssignmentPools.splice(index, 1)"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  :label="t('ip_range_end')"
                  required
                  v-model="ipAssignment.ipRangeEnd"
                  variant="solo-filled"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn :text="t('cancel')" @click="ipAssignmentDialog = false" variant="tonal"></v-btn>
        <v-btn
          :text="t('submit')"
          @click="modifyIpAssignment"
          variant="tonal"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row style="margin-bottom: -25px">
    <v-col>
      <!-- DNS Part -->
      <v-card variant="tonal" height="100%" density="compact">
        <template v-slot:subtitle>
          <div style="display: flex; justify-content: space-between">
            <span>DNS</span>
            <v-btn
              icon="$settings"
              variant="plain"
              @click="dnsDialog = true"
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

      <!-- DNS Dialog -->
      <v-dialog v-model="dnsDialog">
        <v-card>
          <v-card-title>
            <div style="display: flex; justify-content: space-between">
              <span>{{ $t('modify_dns') }}</span>
              <div>
                <v-btn
                  icon="$delete"
                  variant="tonal"
                  @click="removeDns"
                  style="margin-right: 5px"
                ></v-btn>
                <v-btn icon="$add" variant="tonal" @click="network.dns.servers.push('')"></v-btn>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-text-field
                    required
                    variant="solo-filled"
                    v-model="network.dns.domain"
                    :label="$t('domain')"
                  ></v-text-field
                ></v-row>
                <v-row v-for="(server, index) in network.dns.servers" :key="index">
                  <v-text-field
                    :label="t('target')"
                    required
                    variant="solo-filled"
                    append-inner-icon="$delete"
                    @click:append-inner="network.dns.servers.splice(index, 1)"
                    v-model="network.dns.servers[index]"
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn :text="t('cancel')" @click="dnsDialog = false" variant="tonal"></v-btn>
            <v-btn :text="t('submit')" @click="modifyDns" variant="tonal" color="primary"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>

    <v-col>
      <!-- Rules Part -->
      <v-card variant="tonal" height="100%" density="compact">
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
        <template v-slot:item>{{ t('not_implimented_yet') }}</template>
      </v-card>
    </v-col>
  </v-row>
</template>
