import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'mobx-react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import registerServiceWorker from './utilities/registerServiceWorker'
import muiTheme from './theme/muiTheme'
import stores from './stores'
import routes from './navigation/web/routes'
import Navigation from './navigation/web/Navigation'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// Put back in when there's a new version for react 16
// injectTapEventPlugin()

ReactDOM.render(
  <Router>
    <MuiThemeProvider theme={createMuiTheme(muiTheme)}>
      <Provider {...stores}>
        <Navigation>
          {Object.keys(routes).map((key, i) => <Route key={i} {...routes[key]} />)}
        </Navigation>
      </Provider>
    </MuiThemeProvider>
  </Router>,
  document.getElementById('root')
)
registerServiceWorker()
