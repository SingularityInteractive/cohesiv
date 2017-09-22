import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { Paper, Grid, Typography } from 'material-ui'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Tabs, { Tab } from 'material-ui/Tabs'
import { inject, observer } from 'mobx-react'
import { map } from 'lodash'

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
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth>
                  {map(this.subRoutes, ({ value, label }) => (
                    <Tab key={value} label={label} value={value} style={{ textAlign: 'left' }} />
                  ))}
                </Tabs>
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
