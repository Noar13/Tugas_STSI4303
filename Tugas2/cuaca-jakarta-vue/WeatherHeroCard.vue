<template>
  <!-- ======================================================
    WeatherHeroCard.vue  —  Komponen Hero Card
    Menampilkan suhu terkini + waktu dalam format kartu besar.
    Menggunakan ion-card dari Ionic sebagai wrapper.
  ======================================================= -->
  <ion-card class="hero-card" v-if="weather">
    <ion-card-content>
      <div class="hero-inner">

        <!-- Emoji suhu -->
        <div class="hero-emoji">{{ weather.emoji }}</div>

        <!-- Info utama -->
        <div class="hero-info">
          <p class="hero-city">
            <ion-icon :icon="locationOutline" />
            Jakarta, Indonesia
          </p>
          <h1 class="hero-temp">
            {{ weather.temp.toFixed(1) }}<span>°C</span>
          </h1>
          <p class="hero-label">{{ weather.label }}</p>
        </div>

        <!-- Badge waktu -->
        <ion-badge class="hero-badge" color="primary">
          {{ weather.time }}
        </ion-badge>

      </div>

      <!-- Tanggal -->
      <p class="hero-date">{{ weather.date }}</p>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
/**
 * Props:
 *  weather  — objek dari hourlyList (index saat ini)
 *             { temp, emoji, label, time, date, color, bg, border }
 */
import { IonCard, IonCardContent, IonBadge, IonIcon } from '@ionic/vue'
import { locationOutline } from 'ionicons/icons'

defineProps({
  weather: { type: Object, default: null }
})
</script>

<style scoped>
.hero-card {
  margin: 16px;
  background: linear-gradient(135deg, #162340 0%, #0f1e38 100%);
  border: 1px solid var(--c-border);
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

.hero-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-emoji {
  font-size: 3.6rem;
  line-height: 1;
  filter: drop-shadow(0 0 18px rgba(56,189,248,.5));
}

.hero-info { flex: 1; min-width: 140px; }

.hero-city {
  font-size: 0.72rem;
  color: var(--c-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.hero-temp {
  font-size: 3rem;
  font-weight: 700;
  color: var(--c-accent);
  line-height: 1;
  margin: 0;
}
.hero-temp span {
  font-size: 1.2rem;
  font-weight: 300;
}

.hero-label {
  font-size: 0.8rem;
  color: var(--c-muted);
  margin-top: 4px;
}

.hero-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 20px;
}

.hero-date {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--c-muted);
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--c-border);
}
</style>
