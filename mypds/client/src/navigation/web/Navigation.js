import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import SearchIcon from 'material-ui-icons/Search'
import NoteIcon from 'material-ui-icons/FeaturedPlayList'
import MessageIcon from 'material-ui-icons/Message'
import NotificationIcon from 'material-ui-icons/NotificationsNone'
import FingerprintIcon from 'material-ui-icons/Fingerprint'
import Paper from 'material-ui/Paper'
import Icon from 'material-ui/Icon'
import Tabs, { Tab } from 'material-ui/Tabs'
import Small from '../../components/MediaQuery/Small'
import Medium from '../../components/MediaQuery/Medium'
import routes from './routes'
import { getRouteNameFromPath } from '../index'

const styles = {
  root: {
    width: '100%'
  },
  flex: {
    flex: 1
  },
  end: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    marginTop: 'auto'
  }
}

@withStyles(styles)
class Navigation extends Component {
  handleChange = (event, value) => {
    this.props.history.push(routes[value].path)
  }

  render() {
    const { classes, location, history } = this.props
    const routeName = getRouteNameFromPath(location.pathname)
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Small>
            <Toolbar>
              <IconButton color="contrast" aria-label="Menu">
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Small>
          <Medium>
            <Toolbar>
              <div className={classes.flex}>
                <Button color="contrast">Home</Button>
                <Button color="contrast">Feed</Button>
                <Button color="contrast">Content</Button>
              </div>
              <IconButton color="contrast" aria-label="Search">
                <SearchIcon />
              </IconButton>
              <IconButton color="contrast" aria-label="Notes">
                <NoteIcon />
              </IconButton>
              <IconButton color="contrast" aria-label="Messages">
                <MessageIcon />
              </IconButton>
              <IconButton color="contrast" aria-label="Notifications">
                <NotificationIcon />
              </IconButton>
              <IconButton color="contrast" aria-label="Account">
                <FingerprintIcon />
              </IconButton>
            </Toolbar>
          </Medium>
        </AppBar>
        {this.props.children}
        <Small>
          <BottomNavigation
            value={routeName}
            onChange={this.handleChange}
            showLabels={false}
            className={classes.end}
          >
            {Object.keys(routes).filter(key => !routes[key].hidden).map((key, i) =>
              <BottomNavigationButton
                key={i}
                value={key}
                icon={
                  <Icon>
                    {routes[key].icon}
                  </Icon>
                }
              />
            )}
          </BottomNavigation>
        </Small>
      </div>
    )
  }
}

export default withRouter(Navigation)
