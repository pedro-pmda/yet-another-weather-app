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

const formatDate = (dateString: Date): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('default', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(date)
}

onMounted(() => getWeatherFromLocation())

watch(props, () => getWeatherFromLocation())
</script>

<template>
  <div>
    <article
      v-if="data && data.current"
      class="max-w-md w-96 rounded-lg shadow-lg p-4 flex text-black bg-white"
    >
      <div class="basis-1/4 text-left">
        <img :src="data.current.condition.icon" class="h-16 w-16" />
      </div>
      <div class="basis-3/4 text-left">
        <h1 class="text-3x1 font-bold">
          {{ data.current.condition.text }}
          <span class="text-2x1 block"> {{ data.current.temp_c }}&#8451;</span>
        </h1>
        <p>{{ data.location.name }} {{ data.location.region }}</p>
        <p>Precipitation: {{ data.current.precip_mm }}</p>
        <p>{{ formatDate(data.location.localtime) }}</p>
      </div>
    </article>
    <div v-else>Loading...</div>
  </div>
</template>

<style scoped></style>
