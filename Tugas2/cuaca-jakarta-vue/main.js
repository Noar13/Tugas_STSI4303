/* ============================================================
 *  main.js  —  Entry point aplikasi Ionic Vue
 *  Mendaftarkan Ionic framework, router, dan me-mount Vue app
 * ============================================================ */

import { createApp }        from 'vue'
import { IonicVue }         from '@ionic/vue'
import { createRouter, createWebHistory } from '@ionic/vue-router'

/* Ionic CSS (urutan ini penting) */
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* CSS Global Tema */
import './assets/variables.css'

/* Komponen & Router */
import App         from './App.vue'
import router      from './router/index.js'

const app = createApp(App)
  .use(IonicVue)
  .use(router)

router.isReady().then(() => app.mount('#app'))
