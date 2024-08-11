<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import type { Geolocation } from '@/Types'

type WeatherData = {
  location: {
    localtime: Date
    name: string
    region: string
  }
  current: {
    temp_c: number
    temp_f: number
    precip_mm: number
    condition: {
      text: string
      icon: string
    }
    wind_degree: number
    wind_kph: number
    wind_mph: number
  }
}

interface Props {
  coords: Geolocation | undefined
}

const props = withDefaults(defineProps<Props>(), {
  coords: {
    latitude: 40.70693090185166,
    longitude: -73.997820566153
  }
})

const data: Ref<WeatherData | undefined> = ref()

const VITE_APPP_WEATHER_APP_KEY = import.meta.env.VITE_APPP_WEATHER_APP_KEY

const fetchWeather = async (coords: Geolocation): Promise<WeatherData> => {
  const { latitude, longitude } = coords

  const q = `${latitude},${longitude}`

  const res = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${VITE_APPP_WEATHER_APP_KEY}&q=${q}&aqi=no`
  )
  const data = res && res.json()
  return data
}

async function getWeatherFromLocation() {
  if (props.coords) {
    const { latitude, longitude } = props.coords
    const weatherResponse = await fetchWeather({ latitude, longitude })
    data.value = weatherResponse
  }
}

onMounted(() => getWeatherFromLocation())

watch(props, () => getWeatherFromLocation())
</script>

<template>
  <div>
    <pre v-if="data && data.current">
      {{ data }}
    </pre>
    <div v-else>Loading...</div>
  </div>
</template>

<style scoped></style>
