import { mount, shallowMount, flushPromises } from '@vue/test-utils'
import WeatherReport from '@/components/WeatherReport.vue'

import { vi } from 'vitest'

describe('WeatherReport', () => {
  it('should render the component without crashing', async (): Promise<void> => {
    global.fetch = vi.fn() as any

    const wrapper = await shallowMount<typeof WeatherReport>(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0
        }
      }
    })
    expect(wrapper).toBeTruthy()
  })

  it('displays loading message when data is undefined', async (): Promise<void> => {
    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve() })) as any

    const wrapper = await shallowMount<typeof WeatherReport>(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0
        }
      }
    })
    expect(wrapper.text()).toContain('Loading...')
  })

  it('displays loading message when data is defined', async (): Promise<void> => {
    const mockData = {
      location: {
        name: 'New York',
        region: 'New York',
        country: 'United States of America',
        lat: 40.71,
        lon: -74.0,
        tz_id: 'America/New_York',
        localtime_epoch: 1723614347,
        localtime: '2024-08-14 01:45'
      },
      current: {
        last_updated_epoch: 1723614300,
        last_updated: '2024-08-14 01:45',
        temp_c: 22.8,
        temp_f: 73.0,
        is_day: 0,
        condition: {
          text: 'Clear',
          icon: '//cdn.weatherapi.com/weather/64x64/night/113.png',
          code: 1000
        },
        wind_mph: 2.2,
        wind_kph: 3.6,
        wind_degree: 10,
        wind_dir: 'N',
        pressure_mb: 1018.0,
        pressure_in: 30.06,
        precip_mm: 0.0,
        precip_in: 0.0,
        humidity: 57,
        cloud: 0,
        feelslike_c: 24.7,
        feelslike_f: 76.4,
        windchill_c: 24.3,
        windchill_f: 75.7,
        heatindex_c: 25.4,
        heatindex_f: 77.8,
        dewpoint_c: 13.7,
        dewpoint_f: 56.6,
        vis_km: 14.0,
        vis_miles: 8.0,
        uv: 1.0,
        gust_mph: 6.6,
        gust_kph: 10.7
      }
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData)
      })
    ) as any

    const wrapper = mount<typeof WeatherReport>(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0
        }
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain(mockData.current.condition.text)
    expect(wrapper.text()).toContain(mockData.current.temp_c)
    expect(wrapper.text()).toContain(mockData.location.name)
    expect(wrapper.text()).toContain(mockData.location.region)
    expect(wrapper.text()).toContain(mockData.current.wind_kph)
    expect(wrapper.text()).toContain(mockData.current.wind_degree)
  })

  it('displays fromats the datetime to a locale format', async (): Promise<void> => {
    const mockDateTime = new Date(2000, 12, 31, 11, 45, 0, 0)
    vi.setSystemTime(mockDateTime)

    const mockData = {
      location: {
        localtime: mockDateTime
      },
      current: {
        condition: {}
      }
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData)
      })
    ) as any

    const wrapper = mount<typeof WeatherReport>(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0
        }
      }
    })

    await flushPromises()

    const localtime = wrapper.find('[data-testid=localtime]')

    expect(localtime.text()).toEqual('January 31, 2001 at 11:45 AM')
    vi.useRealTimers()
  })
})
