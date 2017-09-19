import { Dimensions, AsyncStorage } from 'react-native'

export default class Device {
  static subscribeToDimensionChanges(handler) {
    Dimensions.addEventListener('change', handler)
    return {
      unsubscribe: () => Dimensions.removeEventListener('change', handler)
    }
  }

  static get dimensions() {
    const window = Dimensions.get('window')
    return {
      window
    }
  }
}
