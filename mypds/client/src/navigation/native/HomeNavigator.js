import React from 'react'
import { TabNavigator, TabBarBottom } from 'react-navigation'
import routes from '../index'
import theme from '../../theme'

import Home from '../../screens/Home/Home.native'
import Account from '../../screens/Account/Account.native'
import Feed from '../../screens/Feed/Feed.native'
import Messages from '../../screens/Messages/Messages.native'
import Notifications from '../../screens/Notifications/Notifications.native'

const HomeRoutes = {
  Home: {
    ...routes.Home,
    screen: Home,
    icon: 'home'
  },
  Messages: {
    ...routes.Messages,
    screen: Messages,
    icon: 'message'
  },
  Feed: {
    ...routes.Feed,
    screen: Feed,
    icon: 'format-align-center'
  },
  Notifications: {
    ...routes.Notifications,
    screen: Notifications,
    icon: 'notifications-none'
  },
  Account: {
    ...routes.Account,
    screen: Account,
    icon: 'account-circle'
  }
}

export default TabNavigator(HomeRoutes, {
  initialRouteName: 'Home',
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  animationEnabled: false,
  tabBarOptions: {
    activeTintColor: theme.palette.primary['500'],
    showLabel: false,
    style: {
      backgroundColor: theme.palette.background.paper
    }
  }
})
