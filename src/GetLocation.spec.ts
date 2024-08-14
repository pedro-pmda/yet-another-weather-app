import { shallowMount } from '@vue/test-utils'
import GetLocation from './components/GetLocation.vue'
import { vi } from 'vitest'

describe('GetLocation', () => {
  it('should render the component without crashing', async (): Promise<void> => {
    global.navigator.geolocation = {
      getCurrentPosition: () => {}
    }
    const wrapper = await shallowMount(GetLocation)
    expect(wrapper).toBeTruthy()
  })
  it('display when geolcation resolved succesfully', async (): Promise<void> => {
    const mockGeoLocation = vi.fn((successCallback: Function) => {
      const position = {
        coords: {
          latitude: 51.5074,
          longitude: -0.1278
        }
      }
      successCallback(position)
    })

    global.navigator.geolocation = {
      getCurrentPosition: mockGeoLocation
    }
    const wrapper = await shallowMount(GetLocation)

    expect(wrapper.vm.coords).toEqual({
      latitude: 51.5074,
      longitude: -0.1278
    })
  })
})
