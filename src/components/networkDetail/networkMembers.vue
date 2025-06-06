<script setup lang="ts">
import { getNetworkMemberById, listNetworkMemberIds } from '@/api/zerotier/controller';
import type { ControllerNetworkMemberInfo } from '@/types/zerotier/controller';
import { showSnackBar } from '@/utils/showSnackBar';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();

const members = ref<ControllerNetworkMemberInfo[]>([]);


onBeforeMount(() => {
  const networkId = route.params.networkId.toString();
  // Get network member ids
  listNetworkMemberIds(networkId).then((memberIds) => {
    Object.keys(memberIds).forEach((memberId) => {
      getNetworkMemberById(networkId, memberId).then((member) => {
        if (member) {
          if (!member.name) {
            member.name = t('network.member.unnamed'); // Default name if not set
          }
          members.value.push(member);
        } else {
          throw new Error(`Failed to get member with ID ${memberId}`);
        }
      });
    });
  }).catch((error) => {
    showSnackBar(t('network.member.error') + error, 'error');
  });
});
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="bg-gray-200 flex items-center justify-between p-2 rounded-lg">
      <input class="w-full h-full focus:outline-none" type="text">
      <button class="hover: bg-gray-400 active:bg-gray-600 rounded-2xl px-2 py-1">
        <img src="@/assets/icons/search.svg" alt="search" class="w-5 h-5">
      </button>
    </div>
    <ol v-if="members.length !== 0" class="text-center">
      <li class="rounded-lg shadow min-h-30 p-3" v-for="member in members" :key="member.id">
        <div class="flex justify-between">
          <input class="font-bold text-xl focus:outline-none border-b-1 border-gray-300" v-model="member.name"
            :style="{ width: (member.name.length + 4) + 'ch' }" type="text" />
          <button class="bg-[#2eb573] rounded-full w-8 h-8 flex items-center justify-center shadow-green-500/50">
            <img src="@/assets/icons/yes.svg" alt="changeAuthorization" class="filter brightness-0 invert w-5 h-5">
          </button>
        </div>
        <div>
          12321
        </div>
        <div>
          12321
        </div>
        <div>
          12321
        </div>
      </li>
    </ol>
  </div>
</template>
