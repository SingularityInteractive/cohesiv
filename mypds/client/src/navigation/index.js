const routes = {
  Home: {
    path: '/',
    exact: true
  },
  Messages: {
    path: '/messages',
    exact: true
  },
  Feed: {
    path: '/feed',
    exact: true
  },
  Notifications: {
    path: '/notifications',
    exact: true
  },
  Account: {
    path: '/account',
    exact: true
  },
  Login: {
    path: '/login',
    exact: true,
    hidden: true
  }
}

export const getActiveIndex = function getActiveIndex(path) {
  let index = 0
  Object.keys(routes).some((key, i) => {
    if (routes[key].path === path) {
      i = index
      return true
    }
  })
  return index
}

export const getRouteNameFromPath = function getRouteNameFromPath(path) {
  let name = ''
  Object.keys(routes).some((key, i) => {
    if (routes[key].path === path) {
      name = key
      return true
    }
  })
  return name
}

export default routes
