<template>
  <!-- ======================================================
    App.vue  —  Root Component
    ion-app   : wrapper utama wajib untuk Ionic
    ion-router-outlet : tempat render setiap halaman/route
  ======================================================= -->
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
/**
 * Ionic mengharuskan <ion-app> sebagai root wrapper.
 * <ion-router-outlet> adalah pengganti <router-view> untuk Ionic Vue
 * agar transisi halaman mobile (slide kiri-kanan) berfungsi.
 */
import { IonApp, IonRouterOutlet } from '@ionic/vue'
</script>
