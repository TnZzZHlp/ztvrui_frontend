<script setup lang="ts">
const { message } = defineProps({ message: String, type: String })
</script>

<template>
  <div
    class="snackbar py-[12px] px-[24px] text-white fixed top-[16px] left-[50%] rounded-lg text-sm z-999 shadow-xl/30"
    :class="type"
  >
    {{ message }}
  </div>
</template>

<style scoped>
.snackbar {
  animation:
    slide-in 0.3s forwards,
    fade-out 0.3s 2.7s forwards;
}

.snackbar.info {
  background-color: rgba(50, 50, 50, 0.9);
}

.snackbar.success {
  background-color: rgba(76, 175, 80, 0.9);
}

.snackbar.error {
  background-color: rgba(244, 67, 54, 0.9);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translate(-50%, 0px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 20px);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
