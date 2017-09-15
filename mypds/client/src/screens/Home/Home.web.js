import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { inject, observer } from 'mobx-react'
import theme from '../../theme'

const styles = {
  root: {
    flexGrow: 1,
    marginTop: 30,
    paddingLeft: 32,
    paddingRight: 32
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  media: {
    height: 200
  }
}

@withStyles(styles)
@inject('Pages')
@observer
export default class Home extends Component {
  componentWillMount() {
    this.props.Pages.addPage()
  }

  render() {
    const { classes, Pages } = this.props
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
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
      </div>
    )
  }
}
