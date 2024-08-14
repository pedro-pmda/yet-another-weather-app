<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

import WeatherReport from './WeatherReport.vue'

import type { Geolocation } from '@/Types'

const coords: Ref<Geolocation | undefined> = ref()

const geolocationBlockedByUser: Ref<boolean> = ref(false)

const getGeolocation = async (): Promise<void> => {
  navigator.geolocation.getCurrentPosition(
    (position: { coords: Geolocation }) => {
      coords.value = position.coords
    },
    (error: { message: string }) => {
      ;(geolocationBlockedByUser.value = true), console.error(error.message)
    }
  )
}

onMounted(() => {
  getGeolocation()
})
</script>

<template>
  <div v-if="coords && !geolocationBlockedByUser">
    Latitude:{{ coords.latitude }} - Longitude:{{ coords.longitude }}
  </div>

  <div v-if="geolocationBlockedByUser">User denied access</div>

  <WeatherReport :coords="coords" />
</template>

<style scoped></style>
