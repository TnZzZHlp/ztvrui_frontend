import { createI18n } from 'vue-i18n'
import zh_cn from './zh_cn'

const i18n = createI18n({
  locale: 'cn', // 设置当前语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  messages: {
    cn: zh_cn,
    en: {
      message: {
        hello: 'hello',
      },
    },
  },
})

export default i18n
