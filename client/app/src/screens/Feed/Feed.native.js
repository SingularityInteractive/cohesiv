import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content } from 'native-base'
import theme from '../../theme'

export default class Feed extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        name="format-align-center"
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
            <Title>Feed</Title>
          </Body>
          <Right />
        </Header>
        <Content />
      </Container>
    )
  }
}
