import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { Typography, IconButton, Grid } from 'material-ui'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import { map, isEqual, each } from 'lodash'
// icons
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import WbSunnyIcon from 'material-ui-icons/WbSunny'
import ShareIcon from 'material-ui-icons/Share'
import LightbulbOutlineIcon from 'material-ui-icons/LightbulbOutline'
import AirplanemodeActiveIcon from 'material-ui-icons/AirplanemodeActive'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  flex: {
    display: 'flex'
  },
  link: {
    marginRight: 8
  },
  iconButton: {
    height: 24,
    width: 24
  },
  textLeft: {
    display: 'inline-block',
    alignSelf: 'flex-start'
  },
  textRight: {
    display: 'inline-block',
    alignSelf: 'flex-end'
  },
  media: {
    height: 72,
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2
  },
  card: {
    borderRadius: 2,
    cursor: 'pointer'
  },
  cardActions: {
    paddingRight: 16,
    paddingBottom: 24,
    paddingLeft: 16,
    paddingTop: 0
  },
  cardActionIconContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  cardActionSubIcon: {
    fill: '#999999',
    height: 16,
    width: 16,
    marginRight: 8
  }
})

@withStyles(styles)
export default class ScrollableCardList extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    cards: []
  }

  state = {
    currentSubset: 0,
    sets: 0,
    previousDisabled: true,
    nextDisabled: false
  }

  componentWillMount() {
    const sets = Math.floor(this.props.cards.length / 3)
    const nextDisabled = sets <= 1

    this.setState({
      sets,
      nextDisabled
    })
  }

  renderCards = () => {
    const { classes, cards } = this.props
    const { currentSubset } = this.state
    // if (!cards.length) return null
    const startingIndex = currentSubset * 3
    const cardsInView = cards.slice(startingIndex, startingIndex + 3)

    const actions = {
      mission: () => (
        <div className={classes.cardActionIconContainer}>
          <AirplanemodeActiveIcon className={classes.cardActionSubIcon} />
          <Typography type="caption">New mission</Typography>
        </div>
      ),
      skill: () => (
        <div className={classes.cardActionIconContainer}>
          <WbSunnyIcon className={classes.cardActionSubIcon} />
          <Typography type="caption">New skill</Typography>
        </div>
      ),
      share: () => (
        <div className={classes.cardActionIconContainer}>
          <ShareIcon className={classes.cardActionSubIcon} />
          <Typography type="caption">New share</Typography>
        </div>
      ),
      story: () => (
        <div className={classes.cardActionIconContainer}>
          <LightbulbOutlineIcon className={classes.cardActionSubIcon} />
          <Typography type="caption">New story</Typography>
        </div>
      ),
      default: () => null
    }

    return (
      <Grid container>
        {map(cardsInView, ({ imgUrl, text, type }, index) => {
          const action = (actions[type] || actions.default)()

          return (
            <Grid item xs={4} key={`${Date.now()}${index}`}>
              <Card className={classes.card} elevation={1}>
                <CardMedia
                  image={imgUrl}
                  title={text}
                  className={classes.media}
                  onClick={() => this._handleCardClick(text)}
                />
                <CardContent>
                  <Typography type="body2">
                    <strong>{text}</strong>
                  </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>{action}</CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    )
  }

  _handleCardClick = card => {
    console.log('take me to this cards page', card)
  }

  _handleScrollClick = direction => {
    const { currentSubset, sets } = this.state
    let previousDisabled = false
    let nextDisabled = false

    const actions = {
      previous: () => {
        if (isEqual(currentSubset, 0)) {
          return null
        } else {
          previousDisabled = isEqual(currentSubset - 1, 0)
          this.setState({ currentSubset: currentSubset - 1, nextDisabled, previousDisabled })
        }
      },
      next: () => {
        if (isEqual(currentSubset, sets)) {
          return null
        } else {
          nextDisabled = isEqual(currentSubset + 1, sets)
          this.setState({ currentSubset: currentSubset + 1, nextDisabled, previousDisabled })
        }
      }
    }

    return actions[direction]()
  }

  render() {
    const { classes, title, handleClick, cards } = this.props
    const { previousDisabled, nextDisabled } = this.state
    return (
      <div className={classes.root}>
        <span className={classes.header}>
          <Typography type="subheading" classes={{ root: classes.textLeft }}>
            {title}
          </Typography>
          <span className={classes.flex}>
            <a href="/" className={classes.link}>
              <Typography type="body2" classes={{ root: classes.textRight }}>
                See all
              </Typography>
            </a>
            <IconButton
              color="primary"
              className={classes.iconButton}
              disabled={previousDisabled}
              aria-label="Scroll previous cards"
              onClick={() => this._handleScrollClick('previous')}>
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              color="primary"
              className={classes.iconButton}
              disabled={nextDisabled}
              aria-label="Scroll next cards"
              onClick={() => this._handleScrollClick('next')}>
              <KeyboardArrowRight />
            </IconButton>
          </span>
        </span>
        {this.renderCards()}
      </div>
    )
  }
}
