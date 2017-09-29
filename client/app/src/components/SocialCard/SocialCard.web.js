import React, { Component } from 'react'
import Proptypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import { Typography, IconButton, Avatar } from 'material-ui'
import Card, { CardContent, CardMedia, CardActions } from 'material-ui/Card'
import Menu, { MenuItem } from 'material-ui/Menu'
import { isEqual } from 'lodash'
import moment from 'moment'
// icons
import MoreVertIcon from 'material-ui-icons/MoreVert'
import ShareIcon from 'material-ui-icons/Share'
import MessageIcon from 'material-ui-icons/Message'

import { UserAvatar } from '../web'

// TODO get a list of all of the types of social cards we'll need
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  row: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  card: {
    paddingTop: 18,
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 24,
    borderRadius: 2
  },
  header: {
    height: 40,
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  content: {
    border: '1px solid #eee',
    borderRadius: 2
  },
  footer: {
    height: 16,
    marginTop: 26,
    justifyContent: 'space-between'
  },
  headerAvatar: {
    marginRight: 14
  },
  userName: {
    display: 'inline-block',
    fontSize: 16,
    marginRight: 8
  },
  eventTime: {
    display: 'inline-block',
    fontSize: 14
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 1.57
  },
  iconButton: {
    height: 16,
    width: 16
  },
  iconFooter: {
    height: 16,
    width: 16,
    fill: '#999'
  }
})

// const Event = {
//   quest_new: props => {
//     const { classes, event } = props
//     return (
//       <Card classes={{ root: classes.card }} elevation={1}>
//         <div className={classNames(classes.row, classes.header)}>
//           <div className={classes.row}>
//             <UserAvatar className={classes.headerAvatar} />
//             <div>
//               <Typography type="body2" className={classes.userName}>
//                 <strong>{event.owner}</strong>
//               </Typography>
//               <Typography type="caption" className={classes.eventTime}>
//                 {moment(event.date).fromNow()}
//               </Typography>
//               <Typography type="caption" className={classes.eventDescription}>
//                 Started a new quest
//               </Typography>
//             </div>
//           </div>
//           <IconButton color="primary" className={classes.iconButton}>
//             <MoreVertIcon />
//           </IconButton>
//         </div>
//       </Card>
//     )
//   },
//   mission_new: props => {
//     return <div>new mission</div>
//   },
//   connection_new: props => {
//     return <div>new connection</div>
//   },
//   default: () => null
// }

@withStyles(styles)
class SocialCard extends Component {
  state = {
    menuOpen: false,
    menuAnchor: null,
    shareOpen: false,
    shareAnchor: null
  }

  _handleMenuClick = ({ currentTarget }) => {
    this.setState({ menuOpen: true, menuAnchor: currentTarget })
  }

  _handleMenuRequestClose = () => {
    this.setState({ menuOpen: false })
  }

  _handleShareClick = ({ currentTarget }) => {
    this.setState({ shareOpen: true, shareAnchor: currentTarget })
  }

  _handleShareRequestClose = () => {
    this.setState({ shareOpen: false })
  }

  // renderEvent(type) {
  //   const { classes, event } = this.props
  //   const { menuOpen, menuAnchor } = this.state
  //   const Event = {
  //     quest_new: () => {
  //       return (
  //         <Card classes={{ root: classes.card }} elevation={1}>
  //           <div className={classNames(classes.row, classes.header)}>
  //             <div className={classes.row}>
  //               <UserAvatar className={classes.headerAvatar} />
  //               <div>
  //                 <Typography type="body2" className={classes.userName}>
  //                   <strong>{event.owner}</strong>
  //                 </Typography>
  //                 <Typography type="caption" className={classes.eventTime}>
  //                   {moment(event.date).fromNow()}
  //                 </Typography>
  //                 <Typography type="caption" className={classes.eventDescription}>
  //                   Started a new quest
  //                 </Typography>
  //               </div>
  //             </div>
  //             <IconButton color="primary" className={classes.iconButton}>
  //               <MoreVertIcon />
  //             </IconButton>
  //             <Menu
  //               anchorEl={menuAnchor}
  //               open={menuOpen}
  //               onRequestClose={this._handleMenuRequestClose}>
  //               <MenuItem onClick={this._handleMenuRequestClose}>Profile</MenuItem>
  //               <MenuItem onClick={this._handleMenuRequestClose}>My account</MenuItem>
  //               <MenuItem onClick={this._handleMenuRequestClose}>Logout</MenuItem>
  //             </Menu>
  //           </div>
  //         </Card>
  //       )
  //     },
  //     mission_new: () => {
  //       return <div>new mission</div>
  //     },
  //     connection_new: () => {
  //       return <div>new connection</div>
  //     },
  //     default: () => null
  //   }

  //   return (Event[type] || Event.default)()
  // }

  render() {
    const { classes, event } = this.props
    const { menuOpen, menuAnchor, shareOpen, shareAnchor } = this.state

    // return <div className={classes.root}>{this.renderEvent(event.type)}</div>
    return (
      <Card classes={{ root: classes.card }} elevation={1}>
        {/* card header */}
        <div className={classNames(classes.row, classes.header)}>
          <div className={classes.row}>
            <UserAvatar className={classes.headerAvatar} />
            <div>
              <Typography type="body2" className={classes.userName}>
                <strong>{event.owner}</strong>
              </Typography>
              <Typography type="caption" className={classes.eventTime}>
                {moment(event.date).fromNow()}
              </Typography>
              <Typography type="caption" className={classes.eventDescription}>
                Started a new quest
              </Typography>
            </div>
          </div>
          <IconButton
            color="primary"
            className={classes.iconButton}
            aria-owns={menuOpen ? 'more-options-menu' : null}
            aria-haspopup="true"
            onClick={this._handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="more-options-menu"
            anchorEl={menuAnchor}
            open={menuOpen}
            onRequestClose={this._handleMenuRequestClose}>
            <MenuItem onClick={this._handleMenuRequestClose}>Delete internet</MenuItem>
            <MenuItem onClick={this._handleMenuRequestClose}>Order pizza</MenuItem>
            <MenuItem onClick={this._handleMenuRequestClose}>Send Mason ETH</MenuItem>
          </Menu>
        </div>
        {/* card content */}
        <div className={classes.content}>im the content!</div>
        {/* card footer */}
        <div className={classNames(classes.row, classes.footer)}>
          <div className={classes.row}>
            <MessageIcon className={classes.iconFooter} style={{ marginRight: 8 }} />
            <Typography type="body2">
              <strong>
                {event.comments.length} comment{event.comments.length > 1 ? 's' : null}
              </strong>
            </Typography>
          </div>
          <IconButton
            color="primary"
            className={classes.iconFooter}
            aria-owns={shareOpen ? 'share-menu' : null}
            aria-haspopup="true"
            onClick={this._handleShareClick}>
            <ShareIcon className={classes.iconFooter} />
          </IconButton>
          <Menu
            id="share-menu"
            anchorEl={shareAnchor}
            open={shareOpen}
            onRequestClose={this._handleShareRequestClose}>
            <MenuItem onClick={this._handleShareRequestClose}>Facebook</MenuItem>
            <MenuItem onClick={this._handleShareRequestClose}>Twitter</MenuItem>
            <MenuItem onClick={this._handleShareRequestClose}>Carrier Pigeon</MenuItem>
          </Menu>
        </div>
      </Card>
    )
  }
}

export default SocialCard
