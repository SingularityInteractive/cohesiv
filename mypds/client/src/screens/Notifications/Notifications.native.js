import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content } from 'native-base'
import config from '../../config'
import theme from '../../theme'

export default class Notifications extends Component {
  static navigationOptions = {
    title: 'Notifications',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        name="notifications-none"
        style={{ color: focused ? tintColor : theme.palette.shades.light.text.secondary }}
      />
    )
  }
  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Notifications</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="more-vert" />
            </Button>
          </Right>
        </Header>
        <Content />
      </Container>
    )
  }
}
