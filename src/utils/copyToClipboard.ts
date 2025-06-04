import { useI18n } from 'vue-i18n'
import { showSnackBar } from './showSnackBar'

const t = useI18n().t

export function copyToClipboard(text: string) {
  // Determine whether the Clipboard API is supported
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showSnackBar(t('copied'), 'success')
      })
      .catch(() => {
        showSnackBar(t('copy_failed'), 'error')
      })
  } else {
    // Fallback handling
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}
