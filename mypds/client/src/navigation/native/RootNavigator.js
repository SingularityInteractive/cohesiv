import { StackNavigator } from 'react-navigation'
import routes from '../index'

import Login from '../../screens/Login/Login.native'
import HomeNavigator from './HomeNavigator'

const RootRoutes = {
  Login: {
    ...routes.Login,
    screen: Login
  },
  Main: {
    screen: HomeNavigator,
    navigationOptions: {
      gesturesEnabled: false
    }
  }
}

export default StackNavigator(RootRoutes, {
  initialRouteName: 'Login',
  headerMode: 'none'
})
