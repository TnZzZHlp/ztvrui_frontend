<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['showSnackBar', 'refreshData'])

const props = defineProps({
  network_members: Array,
  network_members_detail: Array,
})

const { network_members, network_members_detail } = toRefs(props)

const headers = ref([
  { title: t('authorized'), key: 'authorized' },
  { title: t('member_name'), key: 'name' },
  { title: t('member_id'), key: 'id' },
  { title: t('member_address'), key: 'address' },
  { title: t('physical_address'), key: 'physical_address' },
  { title: t('actions'), key: 'actions' },
])

const search = ref('')

const tableFilter = (value, query, item) => {
  const result =
    query &&
    (item.raw.name.toString().toLowerCase().includes(query.toLowerCase()) ||
      item.raw.id.toLowerCase().includes(query.toLowerCase()) ||
      item.raw.ipAssignments.some((ip) => ip.toLowerCase().includes(query.toLowerCase())))

  return result
}

// Save member name
const saveMemberName = (item) => {
  fetch(`/ztapi/controller/network/` + item.nwid + `/member/` + item.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: item.name,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      emit('showSnackBar', 'green', t('save_success'))
      emit('refreshData')
    })
    .catch((err) => {
      console.error(err)
    })
}

// Authorize member
const Authorize = (item) => {
  item.authorized = !item.authorized

  fetch(`/ztapi/controller/network/` + item.nwid + `/member/` + item.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authorized: item.authorized,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (item.authorized) {
        emit('showSnackBar', 'green', t('authorized'))
        emit('refreshData')
      } else {
        emit('showSnackBar', 'red', t('unauthorized'))
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

// Delete member
const deleteMember = (item) => {
  fetch(`/ztapi/controller/network/` + item.nwid + `/member/` + item.id, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => {
      emit('showSnackBar', 'error', t('deleted'))
      emit('refreshData')
    })
    .catch((err) => {
      console.error(err)
    })
}

// Get member detail by ID
const getMemberDetailById = (id: string) => {
  return network_members_detail.value.find((member) => member.address == id)
}

// Get member status by ID
const getMemberStatusById = (id: string) => {
  const member = getMemberDetailById(id)
  if (member) {
    if (member.latency >= 0) {
      return member.paths.find((path) => path.preferred == true).address
    }
  }
}

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
    } catch (error) {
      console.error('There was an error!', error)
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
</script>

<template>
  <v-card variant="tonal">
    <v-data-table-virtual
      :headers="headers"
      :items="network_members"
      style="border-radius: 0"
      :search="search"
      :custom-filter="tableFilter"
      fixed-header
      density="compact"
    >
      <template v-slot:top>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <v-text-field
            variant="underlined"
            append-inner-icon="$search"
            v-model="search"
          ></v-text-field>
          <v-btn icon="$reload" variant="plain" @click="emit('refreshData')"></v-btn>
        </div>
      </template>

      <template v-slot:item.authorized="{ item }">
        <v-checkbox :model-value="item.authorized" @click="Authorize(item)"></v-checkbox>
      </template>

      <template v-slot:item.name="{ item }">
        <v-text-field
          variant="underlined"
          v-model="item.name"
          append-inner-icon="$save"
          @click:appendInner="saveMemberName(item)"
          @keydown.enter="saveMemberName(item)"
          min-width="100"
        >
        </v-text-field>
      </template>

      <template v-slot:item.id="{ item }">
        <v-chip color="primary" small>{{ item.id }}</v-chip>
      </template>

      <template v-slot:item.address="{ item }">
        <div style="display: flex; flex-direction: column">
          <v-btn
            v-for="(ip, index) in item.ipAssignments"
            :key="index"
            append-icon="$copy"
            variant="text"
            size="small"
            @click="copyToClipboard(ip)"
          >
            {{ ip }}
          </v-btn>
        </div>
      </template>

      <template v-slot:item.physical_address="{ item }">
        <v-chip color="primary" small v-if="getMemberStatusById(item.id)">
          {{ getMemberStatusById(item.id) }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn class="me-2" size="small" icon="$edit" @click="console.log('click')"></v-btn>
        <v-btn size="small" icon="$delete" @click="deleteMember(item)"></v-btn>
      </template>

      <template v-slot:no-data>{{ $t('no_members') }}</template>
    </v-data-table-virtual>
  </v-card>
</template>
