import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { Paper, Grid, Typography } from 'material-ui'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Tabs, { Tab } from 'material-ui/Tabs'
import { inject, observer } from 'mobx-react'
import { map } from 'lodash'

import { ToDoCard, ScrollableCardList, SocialCard } from '../../components/web'
import theme from '../../theme'

const styles = {
  root: {
    flexGrow: 1,
    marginTop: 48,
    paddingLeft: 32,
    paddingRight: 32
  },
  container: {
    maxWidth: 600
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  media: {
    height: 200
  },
  tabContainer: {
    marginBottom: 48,
    // puts the 'border' under the tab indicator
    boxShadow: 'inset 0 -1px 1px -1px #cccccc'
  },
  tabIndicator: {
    backgroundColor: '#444444'
  },
  tabRoot: {
    minWidth: 40
  },
  tabLabel: {
    textTransform: 'none'
    // color: '#444444'
  },
  tabLabelContainer: {
    paddingLeft: 0,
    paddingRight: 0
  },
  contentSection: {
    marginBottom: 48
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  textLeft: {
    display: 'inline-block',
    alignSelf: 'flex-start'
  },
  textRight: {
    display: 'inline-block',
    alignSelf: 'flex-end'
  }
}

@withStyles(styles)
@inject('Pages')
@observer
export default class Home extends Component {
  state = {
    currentRoute: 'overview'
  }

  subRoutes = [
    { value: 'overview', label: 'Overview' },
    { value: 'todos', label: "To-do's" },
    { value: 'next-steps', label: 'Next steps' },
    { value: 'social-feed', label: 'Social feed' }
  ]
  // START DUMMIE "DATA"/////////////////////////////////////////////////////////////////////////////////////////////////////
  // TODO: get the stores set up and use them for todos
  todos = [
    {
      mission: 'Journey to Mars',
      type: 'skill',
      task: 'Subsist Off Potatoes',
      hasNotification: true,
      handleClick: () => console.log('you just clicked the skill')
    },
    {
      mission: 'Journey to Mars',
      type: 'share',
      task: 'Recruit One Person to Come With',
      hasNotification: false,
      handleClick: () => console.log('you just clicked the share')
    },
    {
      mission: 'Journey to Mars',
      type: 'react',
      task: 'No Drugs on Mars Policy',
      hasNotification: false,
      handleClick: () => console.log('you just clicked the react')
    }
  ]

  cards = [
    { imgUrl: 'http://lorempixel.com/400/200/', text: 'Rando calrisian #1', type: 'skill' },
    {
      imgUrl: 'http://lorempixel.com/400/200/',
      text: 'qwoijefklj2380jLSKJDfoi23jjaflweijrowamfoe2*)E2309ajsdlkfjwelkfmaskj)E92000',
      type: 'skill'
    },
    {
      imgUrl: 'http://lorempixel.com/400/200/',
      text:
        'This is some super long text, longer than any title of a task ever should be, but hey, its gloo, so who knows ¯_(ツ)_/¯',
      type: 'skill'
    },
    { imgUrl: 'http://lorempixel.com/400/200/', text: 'Purchase moon boots #2', type: 'mission' },
    { imgUrl: 'http://lorempixel.com/400/200/', text: 'Dali is a dog #3', type: 'story' },
    { imgUrl: 'http://lorempixel.com/400/200/', text: 'Learn to tie shoes #4', type: 'skill' },
    {
      imgUrl: 'http://lorempixel.com/400/200/',
      text: 'Making sandwiches: the basics #5',
      type: 'skill'
    },
    {
      imgUrl: 'http://lorempixel.com/400/200/',
      text: 'Making sandwiches: the basics #6',
      type: 'skill'
    },
    {
      imgUrl: 'http://lorempixel.com/400/200/',
      text: 'Making sandwiches: the basics #7',
      type: 'skill'
    },
    {
      imgUrl: 'http://lorempixel.com/400/200/',
      text: 'Making sandwiches: the basics #8',
      type: 'skill'
    }
  ]

  socialEvents = [
    {
      owner: 'John Stamos',
      date: new Date('11/16/1954'),
      imgUrl: 'http://lorempixel.com/400/200/',
      comments: ['wow!', 'so sick!'],
      type: 'quest_new',
      name: 'College of Bureaucracy - Masters Degree',
      description:
        "This if the finest institution and degree one can acquire. Don't believe us? Just ask some of our world-renowned alumni. They're super duper smart",
      missions: 28
    },
    {
      owner: 'John Stamos',
      date: new Date('02/16/1977'),
      imgUrl: 'http://lorempixel.com/200/200/',
      comments: ['noice!', 'you da best!', "you'll get em next time!"],
      type: 'mission_new',
      name: 'My School and I. Wait? Is it "I" or "Me"?',
      parent_quest: 'School for the Future'
    },
    {
      owner: 'Becky Baller',
      date: new Date('02/16/1990'),
      comments: ['keep your chin up'],
      type: 'connection_new',
      connection: 'Andrew Andrews',
      connection_info: "MLKHS Class of '08"
    }
  ]
  // END DUMMIE "DATA"/////////////////////////////////////////////////////////////////////////////////////////////////////

  _handleTabChange = (event, newRoute) => {
    this.setState({ currentRoute: newRoute })
  }

  componentWillMount() {
    this.props.Pages.addPage()
  }
  // NOTE: styled based off of small and media
  render() {
    const { classes, Pages } = this.props
    const { currentRoute } = this.state

    return (
      <div className={classes.root}>
        <Grid container direction="column" align="center">
          <Grid item xs={12} className={classes.container}>
            <Grid container>
              {/* content of page */}
              <Grid item xs={12}>
                {/* page heading */}
                <Typography type="display1">Home</Typography>
                {/* page navigation */}
                <Tabs
                  className={classes.tabContainer}
                  value={currentRoute}
                  onChange={this._handleTabChange}
                  indicatorClassName={classes.tabIndicator}>
                  {map(this.subRoutes, ({ value, label }) => (
                    <Tab
                      key={value}
                      label={label}
                      value={value}
                      classes={{
                        root: classes.tabRoot,
                        label: classes.tabLabel,
                        labelContainer: classes.tabLabelContainer,
                        rootPrimarySelected: classes.tabTest
                      }}
                      disableRipple={true}
                      style={{ marginRight: 40 }}
                    />
                  ))}
                </Tabs>
                {/* page sections */}
                {/* todos */}
                <div className={classes.contentSection}>
                  <span className={classes.sectionHeader}>
                    <Typography type="subheading" classes={{ root: classes.textLeft }}>
                      To-do's
                    </Typography>
                    <a href="/">
                      <Typography type="body2" classes={{ root: classes.textRight }}>
                        See all
                      </Typography>
                    </a>
                  </span>
                  {map(
                    this.todos,
                    ({ mission, type, task, hasNotification, handleClick }, index) => (
                      <ToDoCard
                        key={`${type}${index}`}
                        mission={mission}
                        type={type}
                        task={task}
                        hasNotification={hasNotification}
                        handleClick={handleClick}
                      />
                    )
                  )}
                </div>
                {/* next-steps */}
                <div className={classes.contentSection}>
                  <ScrollableCardList title="Next steps" cards={this.cards} />
                </div>
                {/* social feed */}
                <div className={classes.contentSection}>
                  <span className={classes.sectionHeader}>
                    <Typography type="subheading" classes={{ root: classes.textLeft }}>
                      Social feed
                    </Typography>
                    <a href="/">
                      <Typography type="body2" classes={{ root: classes.textRight }}>
                        See all
                      </Typography>
                    </a>
                  </span>
                  <Grid container direction="column" spacing={16}>
                    {map(this.socialEvents, (event, index) => (
                      <Grid item xs={12} key={`${Date.now()}${index}event`}>
                        <SocialCard event={event} />
                      </Grid>
                    ))}
                  </Grid>
                </div>
                {Pages.pages.map((page, i) => (
                  <Card key={i} className={classes.card}>
                    <CardMedia className={classes.media} title="" image={page.uri} />
                    <CardContent>
                      <Typography type="headline" component="h2">
                        {page.title}
                      </Typography>
                      <Typography component="p">{page.text}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>xs=12 sm=6</Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>xs=12 sm=6</Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>xs=6 sm=3</Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>xs=6 sm=3</Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>xs=6 sm=3</Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>xs=6 sm=3</Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}
