import React, { Component } from 'react'
import { Container, Button } from 'native-base'

export default class Login extends Component {
  render() {
    return (
      <Container>
        <Button onPress={() => this.props.navigation.navigate('Main')} />
      </Container>
    )
  }
}
