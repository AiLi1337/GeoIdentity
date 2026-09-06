import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// Mobile virtual keyboard recovery: ensure viewport scale & scroll bounds restore cleanly when input blurs
if (typeof window !== 'undefined') {
  document.addEventListener('focusout', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
      setTimeout(() => {
        window.scrollTo({
          top: window.scrollY,
          left: 0,
          behavior: 'instant'
        });
      }, 50);
    }
  });
}

createApp(App).mount('#app');

