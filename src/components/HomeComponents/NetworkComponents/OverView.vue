<script setup lang="ts">
import { toRefs } from 'vue'

// Copy Network ID
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

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
 */
const copyToClipboard = (content: string) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(content);
  } else {
    unsecuredCopyToClipboard(content)
  }
}

const props = defineProps({
  network: Object
})

const { network } = toRefs(props)

</script>

<template>
  <v-card variant="tonal" max-width="400" min-height="300">
    <template v-slot:title>
      <p> {{ $t('network_name') }}</p>
      <p>{{ network?.name }}</p>
    </template>

    <template v-slot:subtitle>
      {{ $t('network_id') }}
      <v-btn variant="text" size="small" @click="copyToClipboard(network?.id)">
        <v-icon icon="$copy" />
        {{ network?.id }}
        <v-tooltip activator="parent" location="end" open-on-click :open-on-hover='false'>
          {{ $t('copied') }}
        </v-tooltip>
      </v-btn>
    </template>

    <template v-slot:actions>
    </template>
  </v-card>
</template>
