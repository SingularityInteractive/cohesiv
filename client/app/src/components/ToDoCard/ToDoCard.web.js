import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Paper, Grid, Typography, Icon } from 'material-ui'
// icons
import WbSunnyIcon from 'material-ui-icons/WbSunny'
import ShareIcon from 'material-ui-icons/Share'
import LightbulbOutlineIcon from 'material-ui-icons/LightbulbOutline'
import AirplanemodeActiveIcon from 'material-ui-icons/AirplanemodeActive'

import theme from '../../theme'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: theme.spacing.unit * 2,
    cursor: 'pointer'
  }),
  inlineBlock: {
    display: 'inline-block'
  },
  textContainer: { display: 'flex', alignItems: 'center' },
  iconContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  missionIcon: {
    fill: '#999999'
  },
  notification: {
    backgroundColor: theme.palette.error[500],
    height: 6,
    width: 6,
    borderRadius: 6
  }
})

function ToDoCard(props) {
  const { classes, mission, type, task, hasNotification, handleClick } = props

  const icons = {
    skill: () => <WbSunnyIcon />,
    share: () => <ShareIcon />,
    react: () => <LightbulbOutlineIcon />,
    default: () => null
  }
  const icon = (icons[type] || icons.default)()

  const messages = {
    skill: () => (
      <span className={classes.textContainer}>
        <Typography type="body1" classes={{ root: classes.inlineBlock }}>
          Complete <strong>{task}</strong> skill challenge
        </Typography>
      </span>
    ),
    share: () => (
      <Typography type="body1">
        Share <strong>{task}</strong> story
      </Typography>
    ),
    react: () => (
      <Typography type="body1">
        React to <strong>{task}</strong> story
      </Typography>
    ),
    default: () => null
  }
  const message = (messages[type] || messages.default)()

  return (
    <Paper classes={{ root: classes.root }} elevation={1} onClick={handleClick}>
      <Grid container direction="row">
        <Grid item xs={1} classes={{ 'grid-xs-1': classes.iconContainer }}>
          {icon}
        </Grid>
        <Grid item xs={10}>
          {message}
          <span className={classes.textContainer}>
            <AirplanemodeActiveIcon
              className={classes.missionIcon}
              style={{ height: 16, width: 16, marginRight: 8 }}
            />
            <Typography type="caption" classes={{ root: classes.inlineBlock }}>
              {mission}
            </Typography>
          </span>
        </Grid>
        <Grid item xs={1} className={classes.iconContainer}>
          {hasNotification && <div className={classes.notification} />}
        </Grid>
      </Grid>
    </Paper>
  )
}

ToDoCard.propTypes = {
  mission: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  task: PropTypes.string.isRequired,
  hasNotification: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default withStyles(styles)(ToDoCard)
