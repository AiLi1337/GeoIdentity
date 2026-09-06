import { ref, onMounted } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const canInstall = ref(false);
const isInstalled = ref(false);
const isIos = ref(false);
const showIosGuide = ref(false);

export function usePwaInstall() {
  function handleBeforeInstallPrompt(e: Event) {
    e.preventDefault();
    deferredPrompt.value = e as BeforeInstallPromptEvent;
    canInstall.value = true;
  }

  function handleAppInstalled() {
    isInstalled.value = true;
    canInstall.value = false;
    deferredPrompt.value = null;
  }

  onMounted(() => {
    // Check if already running standalone
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      isInstalled.value = true;
      canInstall.value = false;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    isIos.value = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
  });

  async function promptInstall(): Promise<boolean> {
    if (deferredPrompt.value) {
      try {
        await deferredPrompt.value.prompt();
        const choice = await deferredPrompt.value.userChoice;
        if (choice.outcome === 'accepted') {
          isInstalled.value = true;
          canInstall.value = false;
          deferredPrompt.value = null;
          return true;
        }
      } catch (err) {
        console.warn('PWA install prompt error:', err);
      }
    } else if (isIos.value && !isInstalled.value) {
      showIosGuide.value = true;
    }
    return false;
  }

  return {
    canInstall,
    isInstalled,
    isIos,
    showIosGuide,
    promptInstall
  };
}
