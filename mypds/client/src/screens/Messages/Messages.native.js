import React, { Component } from 'react'
import {
  List,
  Content,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Right,
  Text,
  Icon,
  Container,
  Header,
  Title,
  Button
} from 'native-base'
import theme from '../../theme'

export default class Messages extends Component {
  static navigationOptions = {
    title: 'Messages',
    tabBarIcon: ({ focused, tintColor }) =>
      <Icon
        name="message"
        style={{ color: focused ? tintColor : theme.palette.shades.light.text.secondary }}
      />
  }
  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Messages</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail square size={80} source={{ uri: 'http://lorempixel.com/80/80/' }} />
              </Left>
              <Body>
                <Text>Kumar Pratik</Text>
                <Text note>Doing what you like will always keep you happy . .</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}
