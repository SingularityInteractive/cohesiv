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
  },
  carouselButton: {
    border: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    outline: 'none',
    position: 'relative',
    alignItems: 'center',
    userSelect: 'none',
    textDecoration: 'none',
    justifyContent: 'center',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    padding: 0,
    fontSize: '24px',
    textAlign: 'center',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    flex: '0 0 auto'
  },
  slide: {
    marginRight: 12,
    marginLeft: 12
  },
  firstSlide: {
    marginRight: 12
  },
  lastSlide: {
    marginLeft: 12
  }
})

@withStyles(styles)
export default class ScrollableCardList extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    cards: []
  }

  state = {
    currentIndex: 0
  }

  componentWillMount() {
    this.setState({ totalCards: this.props.cards.length })
  }

  renderCards = () => {
    const { classes, cards } = this.props
    const { currentIndex, totalCards } = this.state

    return map(cards, ({ imgUrl, text, type }, index) => {
      const slideClass = isEqual(index, currentIndex)
        ? classes.firstSlide
        : isEqual(index, currentIndex + 2) ? classes.lastSlide : classes.slide
      return (
        <Slide key={`${Date.now()}${index}`} index={index} innerClassName={slideClass}>
          <div>
            <Card style={{ borderRadius: 2 }}>
              <CardMedia image={imgUrl} title={text} className={classes.media} />
              <CardContent>
                <Typography>{text}</Typography>
              </CardContent>
            </Card>
          </div>
        </Slide>
      )
    })

    // const { imgUrl, text, type } = card
    // return null

    // return (
    //   map(cards.slice(currentIndex, currentIndex + 2))
    // )
    // return (
    //   <Card>
    //     <CardMedia image={imgUrl} title={text} className={classes.media} />
    //     <CardContent>
    //       <Typography>{text}</Typography>
    //     </CardContent>
    //   </Card>
    // )
  }

  _handleScrollClick = direction => {
    const { currentIndex, totalCards } = this.state
    const actions = {
      back: () => {
        if (isEqual(currentIndex, 0)) {
          return null
        } else {
          this.setState({ currentIndex: currentIndex - 1 })
        }
      },
      next: () => {
        if (isEqual(currentIndex, totalCards - 1)) {
          return null
        } else {
          this.setState({ currentIndex: currentIndex + 1 })
        }
      }
    }

    return actions[direction]()
  }

  render() {
    const { classes, title, handleClick, cards } = this.props
    const { currentIndex } = this.state
    console.log('currentIndex', currentIndex)
    return (
      <div className={classes.root}>
        <CarouselProvider
          className={classes.carousel}
          naturalSlideWidth={184}
          naturalSlideHeight={186}
          totalSlides={cards.length}
          visibleSlides={3}
          currentSlide={currentIndex}>
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
              <ButtonBack
                className={classes.carouselButton}
                onClick={() => this._handleScrollClick('back')}>
                <KeyboardArrowLeft />
              </ButtonBack>
              <ButtonNext
                className={classes.carouselButton}
                onClick={() => this._handleScrollClick('next')}>
                <KeyboardArrowRight />
              </ButtonNext>
            </span>
          </span>
          <Slider>{this.renderCards()}</Slider>
        </CarouselProvider>
      </div>
    )
  }
}
