/* ============================================================
 *  router/index.js  —  Konfigurasi Vue Router + Ionic Router
 *  Ionic menggunakan @ionic/vue-router agar animasi halaman
 *  (slide, fade) berjalan dengan benar di mobile.
 * ============================================================ */

import { createRouter, createWebHistory } from '@ionic/vue-router'

/* Lazy-load setiap halaman agar bundle awal lebih kecil */
const routes = [
  {
    path: '/',
    redirect: '/home'           // redirect root → halaman utama
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/detail/:index',
    name: 'Detail',
    component: () => import('@/views/DetailPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
