import { ref, computed } from 'vue';
import { zh } from './zh';
import { en } from './en';

export type SupportedLocale = 'zh' | 'en';

const currentLocale = ref<SupportedLocale>('zh');

export function useI18n() {
  function setLocale(lang: SupportedLocale) {
    currentLocale.value = lang;
    localStorage.setItem('geo_locale', lang);
  }

  // Initialize from storage or browser language
  const saved = localStorage.getItem('geo_locale') as SupportedLocale;
  if (saved && (saved === 'zh' || saved === 'en')) {
    currentLocale.value = saved;
  }

  const messages = computed(() => (currentLocale.value === 'zh' ? zh : en));

  function t(path: string, params?: Record<string, string | number>): string {
    const keys = path.split('.');
    let result: any = messages.value;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return path;
      }
    }

    let str = typeof result === 'string' ? result : path;
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
      });
    }
    return str;
  }

  return {
    locale: currentLocale,
    setLocale,
    t
  };
}
