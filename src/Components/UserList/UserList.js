import React, { Component } from 'react'
import PropTypes from 'prop-types'

class UserList extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      console.log('this.props', this.props)
    }
  }

  render() {
    
    return (
      <div>
        HI
      </div>
    )
  }
}

UserList.propTypes = {

}

export default UserList