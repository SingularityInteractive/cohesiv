import { observable, action } from 'mobx'

class Notifications {
  @observable message = null
  @observable type = null
  @observable isLoading = false

  @action
  resetStore() {
    this.message = null
    this.type = null
  }

  @action
  setMessage(msg, type = null, duration) {
    this.message = msg
    this.type = type
    if (duration) setTimeout(this.resetStore.bind(this), duration)
  }

  @action
  toggleLoading(cb, params) {
    this.isLoading = !this.isLoading
  }
}

export default new Notifications()
