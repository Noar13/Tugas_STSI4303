<template>
  <!-- ======================================================
    DetailPage.vue  —  Halaman Detail Per Jam
    Elemen Ionic yang digunakan:
      • IonPage, IonHeader, IonToolbar, IonTitle
      • IonButtons, IonBackButton   : tombol back otomatis
      • IonContent
      • IonCard, IonCardHeader, IonCardTitle, IonCardContent
      • IonItem, IonLabel, IonNote  : baris info detail
      • IonChip                     : chip label status
      • IonIcon
  ======================================================= -->
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <!-- Tombol back otomatis Ionic -->
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" text="Kembali" />
        </ion-buttons>
        <ion-title>Detail Cuaca</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="item" class="detail-wrap">

        <!-- Kartu besar suhu -->
        <ion-card class="detail-hero" :style="{ borderColor: item.border }">
          <ion-card-content>
            <div class="big-emoji">{{ item.emoji }}</div>
            <div class="big-temp" :style="{ color: item.color }">
              {{ item.temp.toFixed(1) }}<span>°C</span>
            </div>
            <ion-chip :style="{ '--background': item.bg, '--color': item.color, borderColor: item.border }">
              {{ item.label }}
            </ion-chip>
          </ion-card-content>
        </ion-card>

        <!-- Info detail dalam ion-list -->
        <ion-card class="detail-info">
          <ion-card-header>
            <ion-card-title class="info-title">Informasi Lengkap</ion-card-title>
          </ion-card-header>
          <ion-card-content style="padding:0">

            <ion-item lines="inset">
              <ion-icon :icon="calendarOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Tanggal</h3>
                <p>{{ item.date }}</p>
              </ion-label>
            </ion-item>

            <ion-item lines="inset">
              <ion-icon :icon="timeOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Jam Pengukuran</h3>
                <p class="mono">{{ item.time }} WIB</p>
              </ion-label>
            </ion-item>

            <ion-item lines="inset">
              <ion-icon :icon="thermometerOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Temperatur (temperature_2m)</h3>
                <p class="mono" :style="{ color: item.color }">{{ item.temp.toFixed(2) }} °C</p>
              </ion-label>
            </ion-item>

            <ion-item lines="inset">
              <ion-icon :icon="locationOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Koordinat</h3>
                <p class="mono">−6.2° LS, 106.8° BT (Jakarta)</p>
              </ion-label>
            </ion-item>

            <ion-item lines="none">
              <ion-icon :icon="cloudOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Sumber Data</h3>
                <p>Open-Meteo API (open source)</p>
              </ion-label>
              <ion-note slot="end" color="medium">#{{ item.index + 1 }}</ion-note>
            </ion-item>

          </ion-card-content>
        </ion-card>

      </div>

      <!-- Fallback: data tidak ditemukan -->
      <div v-else class="state-box">
        <p>Data tidak ditemukan.</p>
        <ion-button fill="outline" router-link="/home">Kembali ke Beranda</ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed }   from 'vue'
import { useRoute }   from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonBackButton, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonNote, IonChip,
  IonIcon, IonButton
} from '@ionic/vue'
import {
  calendarOutline, timeOutline, thermometerOutline,
  locationOutline, cloudOutline
} from 'ionicons/icons'

import { useWeather } from '@/composables/useWeather.js'

const route = useRoute()
const { hourlyList, fetchWeather } = useWeather()

/* Pastikan data sudah ada (navigasi langsung via URL) */
if (!hourlyList.value.length) fetchWeather()

const item = computed(() => hourlyList.value[Number(route.params.index)] || null)
</script>

<style scoped>
.detail-wrap { padding: 0 0 24px; }

/* Hero card */
.detail-hero {
  margin: 16px;
  background: linear-gradient(135deg, #162340, #0f1e38);
  border: 1px solid;
  border-radius: 20px;
  text-align: center;
}
.big-emoji {
  font-size: 4rem;
  filter: drop-shadow(0 0 20px rgba(56,189,248,.5));
  margin-bottom: 12px;
}
.big-temp {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 16px;
}
.big-temp span { font-size: 1.4rem; font-weight: 300; }

/* Info card */
.detail-info    { margin: 0 16px; background: var(--c-card); border: 1px solid var(--c-border); border-radius: 16px; }
.info-title     { font-size: 0.85rem; color: var(--c-muted); letter-spacing: 0.06em; }

ion-item        { --background: transparent; }
ion-item h3     { font-size: 0.75rem; color: var(--c-muted); margin-bottom: 2px; }
ion-item p      { font-size: 0.9rem; color: var(--c-text); }

.mono           { font-family: var(--font-mono) !important; }

.state-box {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
</style>
