<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

import WeatherReport from './WeatherReport.vue'

import type { Geolocation } from '@/Types'

const coords: Ref<Geolocation | undefined> = ref()

const geolocationBlockedByUsers: Ref<boolean> = ref(false)

const getGeolocation = async (): Promise<void> => {
  navigator.geolocation.getCurrentPosition(
    (position: { coords: Geolocation }) => {
      coords.value = position.coords
    },
    (error: { message: string }) => {
      ;(geolocationBlockedByUsers.value = true), console.error(error.message)
    }
  )
}

onMounted(() => {
  getGeolocation()
})
</script>

<template>
  <div v-if="coords && !geolocationBlockedByUsers">
    Latitude:{{ coords.latitude }} - Longitude:{{ coords.longitude }}
  </div>

  <div v-if="geolocationBlockedByUsers">User denied acces</div>

  <WeatherReport :coords="coords" />
</template>

<style scoped></style>
