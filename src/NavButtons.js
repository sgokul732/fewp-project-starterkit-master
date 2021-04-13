import React, { Component } from 'react'
import { Button, ButtonGroup } from 'reactstrap';
export default class NavButtons extends Component {
  render() {
    return (
      <ButtonGroup>
        <Button onClick={(e)=>this.props.reset()}>All Nearby Recreation Location</Button>
        <Button onClick={(e)=>this.props.parks()}>Parks</Button>
        <Button onClick={(e)=>this.props.gym()}>Gyms</Button>
      </ButtonGroup>
    )
  }
}
