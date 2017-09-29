import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Avatar } from 'material-ui'

const styles = theme => ({
  root: {
    height: 40,
    width: 40,
    border: '2px solid white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)'
  }
})

const UserAvatar = props => {
  const { classes, src } = props
  return <Avatar className={classes.root} src={src} {...props} />
}

UserAvatar.propTypes = {
  src: PropTypes.string
}

UserAvatar.defaultProps = {
  src: require(`../../../assets/avatars/${Math.ceil(Math.random() * 13)}.png`)
}

export default withStyles(styles)(UserAvatar)
