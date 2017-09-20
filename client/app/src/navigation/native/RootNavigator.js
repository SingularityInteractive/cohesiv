import { StackNavigator } from 'react-navigation'
import routes from '../index'

import Login from '../../screens/Login/Login.native'
import MainNavigator from './MainNavigator'

const RootRoutes = {
  Login: {
    ...routes.Login,
    screen: Login
  },
  Main: {
    screen: MainNavigator,
    navigationOptions: {
      gesturesEnabled: false
    }
  }
}

export default StackNavigator(RootRoutes, {
  initialRouteName: 'Login',
  headerMode: 'none'
})
