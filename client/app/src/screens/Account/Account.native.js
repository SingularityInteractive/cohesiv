import React, { Component } from 'react'
import {
  Container,
  Content,
  Button,
  Body,
  Left,
  Header,
  Title,
  Right,
  ListItem,
  Text,
  Icon
} from 'native-base'
import theme from '../../theme'

export default class Account extends Component {
  static navigationOptions = {
    title: 'Account',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        name="account-circle"
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
            <Title>Account</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <ListItem>
            <Text>My Growth</Text>
          </ListItem>
          <ListItem>
            <Text>Connections</Text>
          </ListItem>
          <ListItem>
            <Text>Created Content</Text>
          </ListItem>
          <ListItem>
            <Text>To-Do List</Text>
          </ListItem>
          <ListItem>
            <Text>Settings</Text>
          </ListItem>
          <ListItem last>
            <Text>Help & Feedback</Text>
          </ListItem>
        </Content>
      </Container>
    )
  }
}
