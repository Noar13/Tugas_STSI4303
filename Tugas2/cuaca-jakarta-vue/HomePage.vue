<template>
  <!-- ======================================================
    HomePage.vue  —  Halaman Utama
    Elemen Ionic yang digunakan:
      • IonPage          : wrapper wajib setiap halaman
      • IonHeader        : container navbar atas
      • IonToolbar       : bar dalam header
      • IonTitle         : judul di toolbar
      • IonButtons       : grup tombol di toolbar
      • IonButton        : tombol refresh
      • IonIcon          : ikon dari ionicons
      • IonContent       : area scroll utama
      • IonRefresher     : pull-to-refresh gesture
      • IonSpinner       : loading spinner
      • IonText          : wrapper teks dengan warna Ionic
  ======================================================= -->
  <ion-page>

    <!-- ── Header ── -->
    <ion-header :translucent="true">
      <ion-toolbar>

        <!-- Judul kiri -->
        <ion-title>
          <div class="title-wrap">
            <span class="title-icon">🌤️</span>
            <div>
              <div class="title-main">Cuaca Jakarta</div>
              <div class="title-sub">Prakiraan Per Jam</div>
            </div>
          </div>
        </ion-title>

        <!-- Tombol refresh kanan -->
        <ion-buttons slot="end">
          <ion-button @click="reload" :disabled="isLoading" title="Refresh Data">
            <ion-icon
              slot="icon-only"
              :icon="refreshOutline"
              :class="{ spinning: isLoading }"
            />
          </ion-button>
        </ion-buttons>

      </ion-toolbar>
    </ion-header>

    <!-- ── Konten Utama ── -->
    <ion-content :fullscreen="true">

      <!-- Pull-to-refresh gesture (khas mobile Ionic) -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content
          pulling-text="Tarik untuk refresh..."
          refreshing-spinner="crescent"
          refreshing-text="Memuat data..."
        />
      </ion-refresher>

      <!-- ░░ State: Loading ░░ -->
      <div v-if="isLoading" class="state-box">
        <ion-spinner name="crescent" color="primary" />
        <ion-text color="medium">
          <p>Mengambil data cuaca dari Open-Meteo…</p>
        </ion-text>
      </div>

      <!-- ░░ State: Error ░░ -->
      <div v-else-if="error" class="state-box state-error">
        <div class="state-icon">⚠️</div>
        <ion-text color="medium">
          <p>Gagal memuat data: <strong>{{ error }}</strong></p>
        </ion-text>
        <ion-button fill="outline" size="small" color="primary" @click="reload">
          Coba Lagi
        </ion-button>
      </div>

      <!-- ░░ State: Data Loaded ░░ -->
      <template v-else-if="hourlyList.length">

        <!-- Komponen Hero Card (suhu sekarang) -->
        <WeatherHeroCard :weather="currentWeather" />

        <!-- Label section -->
        <div class="section-label">
          <ion-icon :icon="listOutline" />
          Data Prakiraan 7 Hari ({{ hourlyList.length }} jam)
        </div>

        <!-- Komponen Tabel Data -->
        <WeatherTable
          :items="hourlyList"
          :currentIndex="currentIndex"
          @select="goToDetail"
        />

      </template>

      <!-- ── Footer ── -->
      <div class="footer" v-if="!isLoading">
        <ion-text color="medium">
          <small>
            Sumber: <a href="https://open-meteo.com" target="_blank">open-meteo.com</a>
            · Koordinat: −6.2°, 106.8°
          </small>
        </ion-text>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
/**
 * HomePage.vue menggunakan:
 *  - Composition API Vue 3 (setup, ref, onMounted)
 *  - useWeather composable untuk logika fetch & data
 *  - useIonRouter untuk navigasi ke DetailPage
 */
import { onMounted, nextTick } from 'vue'
import { useIonRouter }        from '@ionic/vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonIcon, IonContent,
  IonRefresher, IonRefresherContent,
  IonSpinner, IonText
} from '@ionic/vue'
import { refreshOutline, listOutline } from 'ionicons/icons'

import { useWeather }    from '@/composables/useWeather.js'
import WeatherHeroCard   from '@/components/WeatherHeroCard.vue'
import WeatherTable      from '@/components/WeatherTable.vue'

/* ── Composable ───────────────────────────────────────────── */
const { hourlyList, currentIndex, currentWeather, isLoading, error, fetchWeather } = useWeather()

/* ── Router ───────────────────────────────────────────────── */
const ionRouter = useIonRouter()

/* ── Methods ──────────────────────────────────────────────── */
async function reload() {
  await fetchWeather()
}

async function handleRefresh(event) {
  await fetchWeather()
  event.target.complete()
}

function goToDetail(item) {
  ionRouter.push({ name: 'Detail', params: { index: item.index } })
}

/* ── Lifecycle ────────────────────────────────────────────── */
onMounted(async () => {
  await fetchWeather()
  // Scroll ke baris "sekarang" setelah render
  await nextTick()
  setTimeout(() => {
    const rows = document.querySelectorAll('.weather-item')
    if (rows[currentIndex.value]) {
      rows[currentIndex.value].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 500)
})
</script>

<style scoped>
/* ── Toolbar title ─────────────────────────────────────────── */
.title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.title-icon { font-size: 1.5rem; }
.title-main { font-weight: 700; font-size: 1rem; }
.title-sub  { font-size: 0.65rem; color: var(--c-muted); letter-spacing: 0.08em; text-transform: uppercase; }

/* ── Spinner spin animation ───────────────────────────────── */
.spinning { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── State boxes ──────────────────────────────────────────── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 24px;
  text-align: center;
}
.state-error .state-icon { font-size: 2.5rem; }

/* ── Section label ────────────────────────────────────────── */
.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-muted);
  padding: 16px 20px 8px;
}

/* ── Footer ───────────────────────────────────────────────── */
.footer {
  text-align: center;
  padding: 16px;
  border-top: 1px solid var(--c-border);
  margin-top: 8px;
}
.footer a { color: var(--c-accent2); text-decoration: none; }
</style>
