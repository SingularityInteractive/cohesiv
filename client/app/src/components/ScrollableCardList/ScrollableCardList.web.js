import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { Typography, IconButton, Grid } from 'material-ui'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import { map, isEqual, each } from 'lodash'
// icons
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'

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
    height: 72
  },
  carousel: {
    width: '100%',
    maxHeight: 186
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

    return (
      <Grid container>
        {map(cardsInView, ({ imgUrl, text, type }, index) => (
          <Grid item xs={4}>
            <Card>
              <CardMedia image={imgUrl} title={text} className={classes.media} />
              <CardContent>
                <Typography>{text}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
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
