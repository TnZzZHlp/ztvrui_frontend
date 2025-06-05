<script setup lang="ts">
import NetworkNameIdComponent from './overView/networkNameId.vue'
import NetworkCreationTimeComponent from './overView/networkCreateTime.vue'
import NetworkTypeComponent from './overView/networkType.vue'
import NetworkMTUComponent from './overView/networkOther.vue'
import NetworkIPAssignmentPoolsComponent from './overView/networkIPAssignmentPools.vue'
import NetworkIPv4AssignmentComponent from './overView/networkIPv4Assignment.vue'
import NetworkIPv6AssignmentComponent from './overView/networkIPv6Assignment.vue'
import NetworkDNSComponent from './overView/networkDNS.vue'
import NetworkRoutesComponent from './overView/networkRoutes.vue'
</script>

<template>
  <div class="p-4 sm:grid-cols-1 grid lg:grid-cols-4 gap-4 w-full">
    <NetworkNameIdComponent />
    <NetworkCreationTimeComponent />
    <NetworkTypeComponent />
    <NetworkMTUComponent />
    <NetworkIPAssignmentPoolsComponent />
    <NetworkIPv4AssignmentComponent />
    <NetworkIPv6AssignmentComponent />
    <NetworkRoutesComponent />
    <NetworkDNSComponent />
  </div>
</template>
