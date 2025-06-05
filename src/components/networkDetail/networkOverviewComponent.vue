<script setup lang="ts">
import NetworkNameIDComponent from './overView/networkNameIDComponent.vue'
import NetworkCreationTimeComponent from './overView/networkCreateTimeComponent.vue'
import NetworkTypeComponent from './overView/networkTypeComponent.vue'
import NetworkMTUComponent from './overView/networkOtherComponent.vue'
import NetworkIPAssignmentPoolsComponent from './overView/networkIPAssignmentPoolsComponent.vue'
import NetworkIPv4AssignmentComponent from './overView/networkIPv4AssignmentComponent.vue'
import NetworkIPv6AssignmentComponent from './overView/networkIPv6AssignmentComponent.vue'
import NetworkDNSComponent from './overView/networkDNSComponent.vue'
</script>

<template>
  <div class="p-4 sm:grid-cols-1 grid lg:grid-cols-4 gap-4 w-full">
    <NetworkNameIDComponent />
    <NetworkCreationTimeComponent />
    <NetworkTypeComponent />
    <NetworkMTUComponent />
    <NetworkIPAssignmentPoolsComponent />
    <NetworkIPv4AssignmentComponent />
    <NetworkIPv6AssignmentComponent />
    <NetworkDNSComponent />
  </div>
</template>
