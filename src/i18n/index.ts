import { createI18n } from 'vue-i18n'
import zh_cn from './zh_cn'
import en from './en'

const i18n = createI18n({
  locale: navigator.language, // 设置当前语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  fallbackLocale: 'en', // 设置默认语言
  messages: {
    'zh-CN': zh_cn,
    en,
  },
})

export default i18n
