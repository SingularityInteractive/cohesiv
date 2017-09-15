import { observable, action } from 'mobx'

class Pages {
  @observable pages = []

  @action
  addPage() {
    this.pages.push({
      uri: 'http://lorempixel.com/400/200/',
      title: 'Gloo',
      text: 'Welcome: Choose an organization to get started'
    })
  }
}

export default new Pages()
