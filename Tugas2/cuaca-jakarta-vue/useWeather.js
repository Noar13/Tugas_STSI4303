/* ============================================================
 *  composables/useWeather.js
 *  Composable (Custom Hook Vue 3) untuk mengambil dan memproses
 *  data cuaca dari Open-Meteo API.
 *
 *  Composable = fungsi yang menggunakan Composition API Vue
 *  sehingga logika bisa di-reuse antar komponen/halaman.
 * ============================================================ */

import { ref, computed } from 'vue'

/* ── Konstanta API ─────────────────────────────────────────── */
const API_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=-6.2&longitude=106.8&hourly=temperature_2m'

/* ── Helper: warna berdasarkan suhu ───────────────────────── */
export function getTempStyle(temp) {
  if (temp >= 35) return { color: '#fb923c', bg: 'rgba(251,146,60,.15)',  border: 'rgba(251,146,60,.4)',  label: 'Sangat Panas', emoji: '🔥' }
  if (temp >= 30) return { color: '#facc15', bg: 'rgba(250,204,21,.12)',  border: 'rgba(250,204,21,.35)', label: 'Panas',        emoji: '☀️' }
  if (temp >= 24) return { color: '#38bdf8', bg: 'rgba(56,189,248,.12)',  border: 'rgba(56,189,248,.35)', label: 'Nyaman',       emoji: '⛅' }
  return               { color: '#a78bfa', bg: 'rgba(167,139,250,.12)', border: 'rgba(167,139,250,.35)',label: 'Sejuk',        emoji: '🌧️' }
}

/* ── Helper: format ISO time ──────────────────────────────── */
export function formatTime(iso) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
    full: d
  }
}

/* ── Composable utama ─────────────────────────────────────── */
export function useWeather() {
  const weatherData = ref(null)   // raw API response
  const isLoading   = ref(false)
  const error       = ref(null)

  /* Transformasi data mentah → array objek terstruktur */
  const hourlyList = computed(() => {
    if (!weatherData.value) return []
    const { time, temperature_2m } = weatherData.value.hourly
    return time.map((iso, index) => {
      const { date, time: jam, full } = formatTime(iso)
      const temp  = temperature_2m[index]
      const style = getTempStyle(temp)
      return { index, iso, date, time: jam, fullDate: full, temp, ...style }
    })
  })

  /* Index jam yang paling mendekati waktu sekarang */
  const currentIndex = computed(() => {
    if (!hourlyList.value.length) return 0
    const now = Date.now()
    let best = 0, bestDiff = Infinity
    hourlyList.value.forEach((item, i) => {
      const diff = Math.abs(item.fullDate - now)
      if (diff < bestDiff) { bestDiff = diff; best = i }
    })
    return best
  })

  /* Data jam sekarang */
  const currentWeather = computed(() => hourlyList.value[currentIndex.value] || null)

  /* ── Fungsi fetch ─────────────────────────────────────── */
  async function fetchWeather() {
    isLoading.value = true
    error.value     = null
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
      weatherData.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  return { hourlyList, currentIndex, currentWeather, isLoading, error, fetchWeather }
}
