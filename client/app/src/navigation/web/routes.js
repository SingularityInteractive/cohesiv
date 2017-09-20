import routes from '../index.js'
import Home from '../../screens/Home/Home.web'
import Login from '../../screens/Login/Login.web'
import Account from '../../screens/Account/Account.web'
import Feed from '../../screens/Feed/Feed.web'
import Messages from '../../screens/Messages/Messages.web'
import Notifications from '../../screens/Notifications/Notifications.web'

export default {
  Home: {
    ...routes.Home,
    component: Home,
    icon: 'home'
  },
  Messages: {
    ...routes.Messages,
    component: Messages,
    icon: 'message'
  },
  Feed: {
    ...routes.Feed,
    component: Feed,
    icon: 'format_align_center'
  },
  Notifications: {
    ...routes.Notifications,
    component: Notifications,
    icon: 'notifications_none'
  },
  Account: {
    ...routes.Account,
    component: Account,
    icon: 'account_circle'
  },
  Login: {
    ...routes.Login,
    component: Login,
    icon: 'fingerprint'
  }
}
