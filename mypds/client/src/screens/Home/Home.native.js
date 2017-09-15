import React, { Component } from 'react'
import { inject, observer } from 'mobx-react/native'
import { Image } from 'react-native'
import {
  Container,
  Card,
  CardItem,
  Header,
  Title,
  Left,
  Thumbnail,
  Button,
  Icon,
  Text,
  Right,
  Body,
  Content,
  Separator
} from 'native-base'
import theme from '../../theme'

@inject('Pages')
@observer
export default class Home extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        name="home"
        style={{ color: focused ? tintColor : theme.palette.shades.light.text.secondary }}
      />
    )
  }

  componentWillMount() {
    this.props.Pages.addPage()
  }

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Home</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="search" />
            </Button>
          </Right>
        </Header>
        <Content style={{ paddingHorizontal: 16 }}>
          <Separator>
            <Text>My Pages</Text>
          </Separator>
          {this.props.Pages.pages.map(page => (
            <Card>
              <CardItem cardBody>
                <Image source={{ uri: page.uri }} style={{ height: 200, width: null, flex: 1 }} />
              </CardItem>
              <CardItem>
                <Left>
                  <Thumbnail source={{ uri: 'Image URL' }} />
                  <Body>
                    <Text>{page.title}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Text>{page.text}</Text>
              </CardItem>
            </Card>
          ))}
        </Content>
      </Container>
    )
  }
}
