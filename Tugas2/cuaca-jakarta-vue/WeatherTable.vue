<template>
  <!-- ======================================================
    WeatherTable.vue  —  Komponen Tabel / List Data Cuaca
    Menampilkan kolom: No, Time (waktu), Temperature_2m (suhu)
    Menggunakan ion-list + ion-item dari Ionic.
    Setiap baris bisa diklik → navigasi ke DetailPage.
  ======================================================= -->

  <!-- Header kolom (sticky) -->
  <div class="table-header">
    <span class="col-no">#</span>
    <span class="col-time">Waktu (Time)</span>
    <span class="col-temp">Suhu (°C)</span>
  </div>

  <!-- ion-list: komponen list standar Ionic -->
  <ion-list :inset="false" lines="none" class="weather-list">
    <ion-item
      v-for="item in items"
      :key="item.index"
      class="weather-item"
      :class="{ 'is-current': item.index === currentIndex }"
      button
      detail="false"
      @click="$emit('select', item)"
    >
      <!-- Nomor -->
      <span class="col-no mono muted">{{ item.index + 1 }}</span>

      <!-- Waktu -->
      <ion-label class="col-time">
        <p class="item-date">{{ item.date }}</p>
        <h3 class="item-time mono">
          {{ item.time }}
          <ion-badge v-if="item.index === currentIndex" color="primary" class="badge-now">
            Sekarang
          </ion-badge>
        </h3>
      </ion-label>

      <!-- Suhu chip -->
      <div
        class="col-temp temp-chip"
        :style="{
          background: item.bg,
          borderColor: item.border,
          color: item.color
        }"
        slot="end"
      >
        <span class="dot" :style="{ background: item.color }"></span>
        {{ item.temp.toFixed(1) }} °C
      </div>
    </ion-item>
  </ion-list>
</template>

<script setup>
/**
 * Props:
 *  items        — array dari hourlyList (composable useWeather)
 *  currentIndex — index jam sekarang
 *
 * Emits:
 *  select(item) — saat baris diklik, kirim data item ke parent
 */
import { IonList, IonItem, IonLabel, IonBadge } from '@ionic/vue'

defineProps({
  items:        { type: Array,  default: () => [] },
  currentIndex: { type: Number, default: 0 }
})
defineEmits(['select'])
</script>

<style scoped>
/* ── Header kolom ──────────────────────────────────────────── */
.table-header {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-muted);
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* ── Kolom layout ─────────────────────────────────────────── */
.col-no   { width: 36px; flex-shrink: 0; }
.col-time { flex: 1; }
.col-temp { min-width: 100px; text-align: right; }

/* ── Ion List ─────────────────────────────────────────────── */
.weather-list {
  background: transparent !important;
  padding: 0;
}

/* ── Ion Item ─────────────────────────────────────────────── */
.weather-item {
  --background:       var(--c-card);
  --background-hover: rgba(56,189,248,.06);
  --border-color:     rgba(36,48,80,.5);
  --padding-start:    20px;
  --padding-end:      20px;
  --inner-padding-end:0;
  border-bottom: 1px solid rgba(36,48,80,.5);
  display: flex;
  align-items: center;
  transition: background .15s;
}
.weather-item.is-current {
  --background: rgba(56,189,248,.08);
}

/* ── Item date/time ───────────────────────────────────────── */
.item-date {
  font-size: 0.7rem !important;
  color: var(--c-muted) !important;
  margin: 0 0 2px;
}
.item-time {
  font-size: 0.9rem !important;
  color: var(--c-text) !important;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.badge-now {
  font-size: 0.58rem;
  padding: 2px 7px;
  border-radius: 20px;
}

/* ── Temp chip ────────────────────────────────────────────── */
.temp-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 30px;
  border: 1px solid;
  font-weight: 600;
  font-size: 0.88rem;
  font-family: var(--font-mono);
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Utility ──────────────────────────────────────────────── */
.mono  { font-family: var(--font-mono); }
.muted { color: var(--c-muted); font-size: 0.75rem; }
</style>
