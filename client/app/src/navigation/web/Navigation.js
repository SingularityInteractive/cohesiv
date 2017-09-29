import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router'
import {
  AppBar,
  Toolbar,
  Grid,
  Typography,
  Button,
  IconButton,
  Paper,
  Icon,
  Avatar
} from 'material-ui'
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation'
import Tabs, { Tab } from 'material-ui/Tabs'
// icons
import MenuIcon from 'material-ui-icons/Menu'
import SearchIcon from 'material-ui-icons/Search'
import NoteIcon from 'material-ui-icons/FeaturedPlayList'
import MessageIcon from 'material-ui-icons/Message'
import NotificationIcon from 'material-ui-icons/NotificationsNone'
import FingerprintIcon from 'material-ui-icons/Fingerprint'
import AddIcon from 'material-ui-icons/Add'

import Small from '../../components/MediaQuery/Small'
import Medium from '../../components/MediaQuery/Medium'
import routes from './routes'
import { getRouteNameFromPath } from '../index'

const styles = {
  root: {
    backgroundColor: '#f8f8f8',
    height: '100%',
    width: '100vw',
    // so that the content isnt covered up by the AppBar
    paddingTop: 48
  },
  end: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    marginTop: 'auto'
  },
  toolbar: {
    marginLeft: 84,
    marginRight: 84,
    height: 72
  },
  // left text nav buttons
  navButton: {
    textTransform: 'none',
    paddingLeft: 36,
    paddingRight: 36,
    height: 40
  },
  navButtonIcon: {
    height: 40
  },
  navButtonRounded: {
    textTransform: 'none',
    fontWeight: 600,
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .7)'
    }
  },
  navButtonRoundedIcon: {
    // otherwise icons are set to inherit
    color: 'rgba(0, 0, 0, 0.87)'
  },
  navButtonRoundedLabel: {
    // sets height of span within button to vertically align text
    height: 20
  },
  avatar: {
    height: 40,
    width: 40,
    border: '2px solid white',
    marginLeft: 40,
    marginRight: 40
  }
}

@withStyles(styles)
class Navigation extends Component {
  handleChange = (event, value) => {
    this.props.history.push(routes[value].path)
  }

  render() {
    const { classes, location, history, children } = this.props
    const routeName = getRouteNameFromPath(location.pathname)
    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="primary">
          <Small>
            <Toolbar>
              <IconButton color="contrast" aria-label="Menu">
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Small>
          <Medium>
            <Toolbar className={classes.toolbar}>
              <Grid container direction="row" align="center">
                <Grid item xs={4}>
                  <Grid container wrap="nowrap" direction="row" justify="center" align="center">
                    <Button className={classes.navButton} color="contrast" aria-label="Home">
                      Home
                    </Button>
                    <Button className={classes.navButton} color="contrast" aria-label="Dashboard">
                      Dashboard
                    </Button>
                    <Button className={classes.navButton} color="contrast" aria-label="Network">
                      Network
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Typography type="title" color="inherit" align="center">
                    [CLIENT_NAME]
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    align="center"
                    wrap="nowrap"
                    spacing={8}>
                    <Grid item>
                      <IconButton
                        color="contrast"
                        aria-label="Messages"
                        className={classes.navButtonIcon}>
                        <MessageIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Avatar
                        src={require(`../../../assets/avatars/${Math.ceil(
                          Math.random() * 13
                        )}.png`)}
                        className={classes.avatar}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        classes={{
                          root: classes.navButtonRounded,
                          label: classes.navButtonRoundedLabel
                        }}
                        color="contrast"
                        aria-label="Upload New">
                        <AddIcon className={classes.navButtonRoundedIcon} />
                        <Typography>Upload new</Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </Medium>
        </AppBar>
        {children}
        <Small>
          <BottomNavigation
            value={routeName}
            onChange={this.handleChange}
            showLabels={false}
            className={classes.end}>
            {Object.keys(routes)
              .filter(key => !routes[key].hidden)
              .map((key, i) => (
                <BottomNavigationButton
                  key={i}
                  value={key}
                  icon={<Icon>{routes[key].icon}</Icon>}
                />
              ))}
          </BottomNavigation>
        </Small>
      </div>
    )
  }
}

export default withRouter(Navigation)
