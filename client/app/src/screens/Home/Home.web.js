import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { Paper, Grid, Typography } from 'material-ui'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Tabs, { Tab } from 'material-ui/Tabs'
import { inject, observer } from 'mobx-react'
import { map } from 'lodash'

import { ToDoCard } from '../../components/web'
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
                {map(this.todos, ({ mission, type, task, hasNotification, handleClick }, index) => (
                  <ToDoCard
                    key={`${type}${index}`}
                    mission={mission}
                    type={type}
                    task={task}
                    hasNotification={hasNotification}
                    handleClick={handleClick}
                  />
                ))}
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
