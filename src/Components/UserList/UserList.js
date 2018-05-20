import React, { Component } from 'react'
import PropTypes from 'prop-types'

class UserList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userList: [],
      error: ''
    }
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps !== this.props)
    if(prevProps !== this.props) {
      // this.fetchUserList();
      this.renewSession();
    }
  }

  // checkSession = async () => {
  //   try {
  //     const api_key = this.props.token;
  //     console.log(api_key)
  //     const initialFetch = await fetch('/authenticate', {
  //       method: 'GET',
  //       headers: { 'Content-type': 'application/json',
  //                  'x-api-key': api_key }
  //     })
  //     const checkSession = await initialFetch.json();
  //     // this.setState({ userList })
  //     console.log('check session', checkSession )
  //   } catch(error) {
  //     this.setState({ error })
  //     console.log('check err', error)
  //   }
  // }

  renewSession = async () => {
    try {
      const api_key = this.props.token;
      const renew_key = this.props.renew;
      const initialFetch = await fetch('http://localhost:3000/authenticate/renew', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          'renew_key': renew_key
        })
      })
      const renewSession = await initialFetch.json();
      console.log('renew session', renewSession )
      this.fetchUserList()
    } catch(error) {
      this.setState({ error })
      console.log('renew err', error)
    }
  }

  fetchUserList = async () => {
    console.log('fr')
    try {
      const api_key = this.props.token;
      console.log(api_key)
      const initialFetch = await fetch('http://localhost:3000/api/users?limit=9&page=1', {
        method: 'GET',
        headers: { 'Content-type': 'application/json',
                   'x-api-key':  api_key }
      })
      const userList = await initialFetch.json();
      this.setState({ userList })
      console.log(this.state.userList)
    } catch(error) {
      this.setState({ error })
      console.log(error)
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