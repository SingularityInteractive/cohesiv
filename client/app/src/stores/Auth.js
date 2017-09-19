import { AsyncStorage } from 'react-native'
import { observable, action, computed } from 'mobx'
const StorageKey = {
  ID_TOKEN: 'ID_TOKEN',
  PROFILE: 'PROFILE'
}

class Auth {
  @observable networkType = null
  @observable isLoggingIn = false
  @observable idToken = null
  @observable
  profile = {
    user_id: null,
    name: null,
    username: null,
    avatar_url: null
  }
  @observable error = null

  constructor() {
    this.getStoredAuthState()
  }

  @computed
  get isLoggedIn() {
    return this.idToken !== null
  }

  @action
  setNetworkType(networkType) {
    this.networkType = networkType
  }

  @action
  resetStore() {
    this.profile = {
      user_id: null,
      name: null,
      username: null,
      avatar_url: null
    }
    this.idToken = null
    this.isLoggingIn = false
  }

  @action
  async login(creds) {
    await Promise.all([
      await AsyncStorage.setItem(StorageKey.ID_TOKEN, 'abcd1234'),
      await AsyncStorage.setItem(StorageKey.PROFILE, JSON.stringify({ user_id: '1' }))
    ])
  }

  @action
  async logout() {
    await this.removeStoredAuthState()
    this.resetStore()
  }

  @action
  async onError(error) {
    this.error = error
    console.error(error)
    await this.removeStoredAuthState()
  }

  @action
  async getStoredAuthState() {
    try {
      const idToken = await AsyncStorage.getItem(StorageKey.ID_TOKEN)
      const profile = await AsyncStorage.getItem(StorageKey.PROFILE)
      if (idToken !== null) this.idToken = idToken
      if (profile !== null) this.profile = JSON.parse(profile)
    } catch (err) {
      this.onError(err.message)
    }
  }

  async removeStoredAuthState() {
    return Promise.all([
      await AsyncStorage.removeItem(StorageKey.ID_TOKEN),
      await AsyncStorage.removeItem(StorageKey.PROFILE)
    ])
  }
}

export default new Auth()
