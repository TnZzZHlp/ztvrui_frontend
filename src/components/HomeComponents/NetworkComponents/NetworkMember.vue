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
const deleteMemberDialog = ref(false)
const currentDeleteMember = ref(null)
const openDeleteMemberDialog = (item) => {
  deleteMemberDialog.value = true
  currentDeleteMember.value = item
}

const deleteMember = (item) => {
  fetch(`/ztapi/controller/network/` + item.nwid + `/member/` + item.id, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => {
      emit('showSnackBar', 'error', t('deleted'))
      deleteMemberDialog.value = false
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

// Edit Network Member Dialog
const editMemberDialog = ref(false)
const currentEditMember = ref(null)
const openEditMemberDialog = (item) => {
  editMemberDialog.value = true
  currentEditMember.value = item
}
const editMember = () => {
  fetch(
    `/ztapi/controller/network/` +
      currentEditMember.value.nwid +
      `/member/` +
      currentEditMember.value.id,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activeBridge: currentEditMember.value.activeBridge,
        ipAssignments: currentEditMember.value.ipAssignments,
        noAutoAssignIps: currentEditMember.value.noAutoAssignIps,
      }),
    },
  )
    .then((res) => res.json())
    .then((data) => {
      emit('showSnackBar', 'green', t('save_success'))
      editMemberDialog.value = false
      emit('refreshData')
    })
    .catch((err) => {
      console.error(err)
    })
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
        <v-btn
          size="small"
          icon="$delete"
          color="error"
          @click="openDeleteMemberDialog(item)"
          style="margin-right: 10px"
          variant="tonal"
        ></v-btn>
        <v-btn
          size="small"
          icon="$edit"
          @click="openEditMemberDialog(item)"
          variant="tonal"
        ></v-btn>
      </template>

      <template v-slot:no-data>{{ $t('no_members') }}</template>
    </v-data-table-virtual>
  </v-card>

  <!-- Delete Network Member Dialog -->
  <v-dialog v-model="deleteMemberDialog" width="400">
    <v-card>
      <v-card-title>
        <div style="display: flex; justify-content: space-between">
          <span>{{ $t('confirm_delete_member') + '?' }}</span>
        </div>
      </v-card-title>
      <v-card-actions>
        <v-btn
          :text="t('confirm_delete_member')"
          variant="outlined"
          color="error"
          prepend-icon="$delete"
          size="small"
          @click="deleteMember(currentDeleteMember)"
          style="margin-right: 10px"
        ></v-btn>
        <v-btn
          :text="t('cancel')"
          @click="deleteMemberDialog = false"
          variant="outlined"
          size="small"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Edit Network Member Dialog -->
  <v-dialog v-model="editMemberDialog">
    <v-card>
      <v-card-title>
        <div style="display: flex; justify-content: space-between">
          <span>{{ $t('modify_member_info') }}</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-checkbox :label="$t('active_bridge')" v-model="currentEditMember.activeBridge">
              </v-checkbox>
            </v-row>
            <v-row>
              <v-container>
                <v-row>
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 100%;
                      padding-bottom: 10px;
                    "
                  >
                    <span style="font-size: 20px">{{ t('ip_assignment') }}</span>
                    <v-btn
                      icon="$add"
                      @click="currentEditMember.ipAssignments.push('')"
                      size="x-small"
                      variant="tonal"
                    ></v-btn>
                  </div>
                </v-row>
                <v-row v-for="(ip, index) in currentEditMember.ipAssignments" :key="index">
                  <v-text-field
                    variant="solo-filled"
                    v-model="currentEditMember.ipAssignments[index]"
                    append-icon="$delete"
                    @click:append="currentEditMember.ipAssignments.splice(index, 1)"
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-row>
            <v-row>
              <v-checkbox
                :label="$t('no_auto_assign_ips')"
                v-model="currentEditMember.noAutoAssignIps"
              >
              </v-checkbox>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn :text="t('cancel')" @click="editMemberDialog = false" variant="tonal"></v-btn>
        <v-btn :text="t('submit')" variant="tonal" color="primary" @click="editMember"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
