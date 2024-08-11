<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

type Geolocation = {
  latitude: number
  longitude: number
}

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
    {{ coords.latitude }} - {{ coords.longitude }}
  </div>

  <div v-if="geolocationBlockedByUsers">User denied acces</div>
</template>

<style scoped></style>
