import { AsyncStorage } from 'react-native'
import { observable, action, computed } from 'mobx'
import { ID_TOKEN, PROFILE } from '../utilities/storageEnums'

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
      await AsyncStorage.setItem(ID_TOKEN, 'abcd1234'),
      await AsyncStorage.setItem(PROFILE, JSON.stringify({ user_id: '1' }))
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
      const idToken = await AsyncStorage.getItem(ID_TOKEN)
      const profile = await AsyncStorage.getItem(PROFILE)
      if (idToken !== null) this.idToken = idToken
      if (profile !== null) this.profile = JSON.parse(profile)
    } catch (err) {
      this.onError(err.message)
    }
  }

  async removeStoredAuthState() {
    return Promise.all([
      await AsyncStorage.removeItem(ID_TOKEN),
      await AsyncStorage.removeItem(PROFILE)
    ])
  }
}

export default new Auth()
