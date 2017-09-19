import Expo from 'expo'
import React, { Component } from 'react'
import cacheAssetsAsync from './src/utilities/cacheAssetsAsync'
import { Root as NativeBaseRoot, StyleProvider, Container } from 'native-base'
import { Provider } from 'mobx-react'
import getTheme from './src/theme/components'
import material from './src/theme/nativeBaseMaterial'
import stores from './src/stores'
import RootNavigator from './src/navigation/native/RootNavigator'

export default class App extends Component {
  state = {
    appIsReady: false
  }

  componentWillMount() {
    this.loadAssetsAsync()
  }

  async loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [],
        fonts: [
          {
            Roboto: require('./assets/fonts/Roboto-Regular.ttf')
          }
        ]
      })
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: App.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      )
    } finally {
      this.setState({ appIsReady: true })
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <NativeBaseRoot>
          {/* TODO: Uncomment when react-router catches up to react-native backhandler, <AndroidBackButton> */}
          <StyleProvider style={getTheme(material)}>
            <Provider {...stores}>
              <RootNavigator />
            </Provider>
          </StyleProvider>
          {/* </AndroidBackButton> */}
        </NativeBaseRoot>
      )
    } else {
      return <Expo.AppLoading />
    }
  }
}
