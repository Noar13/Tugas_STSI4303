<template>
  <ion-page>
    <!-- ═══════════════════════════════════════════
         HEADER
    ════════════════════════════════════════════ -->
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>
          <div class="title-wrap">
            <span class="title-icon">🌤️</span>
            <div>
              <div class="title-main">Cuaca Jakarta</div>
              <div class="title-sub">Prakiraan Per Jam</div>
            </div>
          </div>
        </ion-title>

        <ion-buttons slot="end">
          <ion-button @click="fetchWeather" :disabled="isLoading">
            <ion-icon
              slot="icon-only"
              :icon="refreshOutline"
              :class="{ spinning: isLoading }"
            />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- ═══════════════════════════════════════════
         CONTENT
    ════════════════════════════════════════════ -->
    <ion-content :fullscreen="true">

      <!-- Collapsible large header (iOS style) -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Cuaca Jakarta</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Pull-to-Refresh -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content
          pulling-text="Tarik untuk refresh..."
          refreshing-spinner="crescent"
          refreshing-text="Memuat data..."
        />
      </ion-refresher>

      <!-- ░░ STATE: LOADING ░░ -->
      <div v-if="isLoading" id="container">
        <ion-spinner name="crescent" color="primary" />
        <p>Mengambil data cuaca dari Open-Meteo…</p>
      </div>

      <!-- ░░ STATE: ERROR ░░ -->
      <div v-else-if="error" id="container">
        <strong>⚠️ Gagal Memuat Data</strong>
        <p>{{ error }}</p>
        <ion-button fill="outline" size="small" color="primary" @click="fetchWeather" style="margin-top:12px">
          Coba Lagi
        </ion-button>
      </div>

      <!-- ░░ STATE: DATA LOADED ░░ -->
      <template v-else-if="hourlyList.length">

        <!-- ── Hero Card ── -->
        <ion-card class="hero-card" v-if="currentWeather">
          <ion-card-content>
            <div class="hero-inner">
              <div class="hero-emoji">{{ currentWeather.emoji }}</div>
              <div class="hero-info">
                <p class="hero-city">
                  <ion-icon :icon="locationOutline" />
                  Jakarta, Indonesia
                </p>
                <h1 class="hero-temp">
                  {{ currentWeather.temp.toFixed(1) }}<span>°C</span>
                </h1>
                <p class="hero-label">{{ currentWeather.label }}</p>
              </div>
              <ion-badge color="primary" class="hero-time-badge">
                {{ currentWeather.time }}
              </ion-badge>
            </div>
            <p class="hero-date">{{ currentWeather.date }}</p>
          </ion-card-content>
        </ion-card>

        <!-- ── Section Label ── -->
        <div class="section-label">
          <ion-icon :icon="listOutline" />
          Data Prakiraan 7 Hari ({{ hourlyList.length }} jam)
        </div>

        <!-- ── Tabel Header ── -->
        <div class="table-header">
          <span class="col-no">#</span>
          <span class="col-time">Waktu (Time)</span>
          <span class="col-temp">Suhu (°C)</span>
        </div>

        <!-- ── Ion List: Data Per Jam ── -->
        <ion-list lines="none">
          <ion-item
            v-for="item in hourlyList"
            :key="item.index"
            class="weather-item"
            :class="{ 'is-current': item.index === currentIndex }"
          >
            <!-- Nomor -->
            <span class="col-no mono muted">{{ item.index + 1 }}</span>

            <!-- Waktu -->
            <ion-label class="col-time">
              <p class="item-date">{{ item.date }}</p>
              <h3 class="item-time mono">
                {{ item.time }}
                <ion-badge
                  v-if="item.index === currentIndex"
                  color="primary"
                  class="badge-now"
                >
                  Sekarang
                </ion-badge>
              </h3>
            </ion-label>

            <!-- Suhu Chip -->
            <div
              class="temp-chip"
              slot="end"
              :style="{
                background:   item.bg,
                borderColor:  item.border,
                color:        item.color
              }"
            >
              <span class="dot" :style="{ background: item.color }"></span>
              {{ item.temp.toFixed(1) }} °C
            </div>
          </ion-item>
        </ion-list>

        <!-- ── Footer ── -->
        <div class="footer">
          <ion-text color="medium">
            <small>
              Sumber:
              <a href="https://open-meteo.com" target="_blank">open-meteo.com</a>
              · Koordinat: −6.2°, 106.8°
            </small>
          </ion-text>
        </div>

      </template>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonIcon,
  IonContent, IonRefresher, IonRefresherContent,
  IonSpinner, IonText,
  IonCard, IonCardContent,
  IonList, IonItem, IonLabel, IonBadge
} from '@ionic/vue'
import { refreshOutline, locationOutline, listOutline } from 'ionicons/icons'

// ─── Tipe Data ──────────────────────────────────────────────
interface HourlyData {
  time:            string[]
  temperature_2m:  number[]
}
interface WeatherResponse {
  hourly: HourlyData
}
interface HourlyItem {
  index:    number
  iso:      string
  date:     string
  time:     string
  fullDate: Date
  temp:     number
  emoji:    string
  label:    string
  color:    string
  bg:       string
  border:   string
}

// ─── Konstanta ───────────────────────────────────────────────
const API_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=-6.2&longitude=106.8&hourly=temperature_2m'

// ─── State ───────────────────────────────────────────────────
const weatherData = ref<WeatherResponse | null>(null)
const isLoading   = ref(false)
const error       = ref<string | null>(null)

// ─── Helper: style berdasarkan suhu ─────────────────────────
function getTempStyle(temp: number) {
  if (temp >= 35) return { color: '#fb923c', bg: 'rgba(251,146,60,.15)',  border: 'rgba(251,146,60,.4)',  label: 'Sangat Panas', emoji: '🔥' }
  if (temp >= 30) return { color: '#facc15', bg: 'rgba(250,204,21,.12)',  border: 'rgba(250,204,21,.35)', label: 'Panas',        emoji: '☀️' }
  if (temp >= 24) return { color: '#38bdf8', bg: 'rgba(56,189,248,.12)',  border: 'rgba(56,189,248,.35)', label: 'Nyaman',       emoji: '⛅' }
  return               { color: '#a78bfa', bg: 'rgba(167,139,250,.12)', border: 'rgba(167,139,250,.35)',label: 'Sejuk',        emoji: '🌧️' }
}

// ─── Helper: format ISO → { date, time } ────────────────────
function formatTime(iso: string) {
  const d = new Date(iso)
  return {
    date:     d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time:     d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
    fullDate: d
  }
}

// ─── Computed: list per jam ───────────────────────────────────
const hourlyList = computed<HourlyItem[]>(() => {
  if (!weatherData.value) return []
  const { time, temperature_2m } = weatherData.value.hourly
  return time.map((iso, index) => {
    const { date, time: jam, fullDate } = formatTime(iso)
    const temp  = temperature_2m[index]
    const style = getTempStyle(temp)
    return { index, iso, date, time: jam, fullDate, temp, ...style }
  })
})

// ─── Computed: index jam terdekat sekarang ───────────────────
const currentIndex = computed(() => {
  if (!hourlyList.value.length) return 0
  const now = Date.now()
  let best = 0, bestDiff = Infinity
  hourlyList.value.forEach((item, i) => {
    const diff = Math.abs(item.fullDate.getTime() - now)
    if (diff < bestDiff) { bestDiff = diff; best = i }
  })
  return best
})

// ─── Computed: data jam sekarang ─────────────────────────────
const currentWeather = computed(() => hourlyList.value[currentIndex.value] ?? null)

// ─── Fetch API ────────────────────────────────────────────────
async function fetchWeather() {
  isLoading.value = true
  error.value     = null
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
    weatherData.value = await res.json()
  } catch (e: any) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

// ─── Pull-to-refresh ─────────────────────────────────────────
async function handleRefresh(event: CustomEvent) {
  await fetchWeather()
  ;(event.target as HTMLIonRefresherElement).complete()
}

// ─── Lifecycle ────────────────────────────────────────────────
onMounted(() => fetchWeather())
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════════════ */
:root {
  --c-bg:      #0b0f1a;
  --c-surface: #131929;
  --c-card:    #1a2235;
  --c-border:  #243050;
  --c-accent:  #38bdf8;
  --c-muted:   #64748b;
  --c-text:    #e2e8f0;
  --font-mono: 'JetBrains Mono', monospace;
}

/* ═══════════════════════════════════════════════════
   LOADING / ERROR STATE (#container)
════════════════════════════════════════════════════ */
#container {
  text-align: center;
  position: absolute;
  left: 0; right: 0; top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
}
#container strong {
  font-size: 18px;
  line-height: 26px;
}
#container p {
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

/* ═══════════════════════════════════════════════════
   TOOLBAR TITLE
════════════════════════════════════════════════════ */
.title-wrap  { display: flex; align-items: center; gap: 10px; }
.title-icon  { font-size: 1.5rem; }
.title-main  { font-weight: 700; font-size: 1rem; }
.title-sub   {
  font-size: 0.62rem;
  color: #64748b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ═══════════════════════════════════════════════════
   HERO CARD
════════════════════════════════════════════════════ */
.hero-card {
  margin: 16px;
  background: linear-gradient(135deg, #162340 0%, #0f1e38 100%);
  border: 1px solid #243050;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,.4);
  overflow: hidden;
  position: relative;
}
.hero-card::before {
  content: '';
  position: absolute;
  top: -50px; right: -50px;
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(56,189,248,.2) 0%, transparent 70%);
  pointer-events: none;
}

.hero-inner  { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.hero-emoji  {
  font-size: 3.5rem;
  line-height: 1;
  filter: drop-shadow(0 0 18px rgba(56,189,248,.5));
}
.hero-info   { flex: 1; min-width: 130px; }

.hero-city {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 0 4px;
}
.hero-temp {
  font-size: 2.8rem;
  font-weight: 700;
  color: #38bdf8;
  line-height: 1;
  margin: 0;
}
.hero-temp span { font-size: 1.1rem; font-weight: 300; }
.hero-label     { font-size: 0.78rem; color: #64748b; margin: 4px 0 0; }

.hero-time-badge {
  font-size: 0.72rem;
  padding: 6px 12px;
  border-radius: 20px;
  align-self: flex-start;
}
.hero-date {
  font-size: 0.68rem;
  color: #64748b;
  margin: 12px 0 0;
  padding-top: 12px;
  border-top: 1px solid #243050;
}

/* ═══════════════════════════════════════════════════
   SECTION LABEL
════════════════════════════════════════════════════ */
.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
  padding: 16px 20px 8px;
}

/* ═══════════════════════════════════════════════════
   TABLE HEADER (sticky)
════════════════════════════════════════════════════ */
.table-header {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
  background: #131929;
  border-top: 1px solid #243050;
  border-bottom: 1px solid #243050;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* ═══════════════════════════════════════════════════
   COLUMN SIZES (dipakai di header + item)
════════════════════════════════════════════════════ */
.col-no   { width: 36px; flex-shrink: 0; }
.col-time { flex: 1; }
.col-temp { min-width: 105px; text-align: right; }

/* ═══════════════════════════════════════════════════
   ION-LIST & ION-ITEM
════════════════════════════════════════════════════ */
ion-list { background: transparent !important; padding: 0 !important; }

.weather-item {
  --background:       #1a2235;
  --background-hover: rgba(56,189,248,.06);
  --inner-padding-end: 16px;
  --padding-start:    20px;
  border-bottom: 1px solid rgba(36,48,80,.5);
  display: flex;
  align-items: center;
}
.weather-item.is-current {
  --background: rgba(56,189,248,.09);
}

.item-date {
  font-size: 0.68rem !important;
  color: #64748b !important;
  margin: 0 0 2px !important;
}
.item-time {
  font-size: 0.88rem !important;
  color: #e2e8f0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  margin: 0 !important;
}

.badge-now {
  font-size: 0.56rem;
  padding: 2px 7px;
  border-radius: 20px;
}

/* ═══════════════════════════════════════════════════
   TEMP CHIP
════════════════════════════════════════════════════ */
.temp-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 30px;
  border: 1px solid;
  font-weight: 600;
  font-size: 0.84rem;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════ */
.footer {
  text-align: center;
  padding: 16px;
  border-top: 1px solid #243050;
  margin-top: 8px;
}
.footer a { color: #818cf8; text-decoration: none; }

/* ═══════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════════ */
.mono  { font-family: 'JetBrains Mono', monospace !important; }
.muted { color: #64748b; font-size: 0.75rem; }

.spinning { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>