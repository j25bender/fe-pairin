import React, { Component } from 'react'
import './UserList.css'
import PropTypes from 'prop-types'

class UserList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userList: [],
      error: '',
      key: '',
      renew: ''
    }
  }

  componentDidMount() {
    console.log('props', this.props)
    // console.log(prevProps !== this.props)
      // this.fetchUserList();
      this.renewSession();
    
  }

  // checkSession = async () => {
  //   try {
  //     const api_key = this.props.key;
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
      const key = this.props.key;
      const renew = this.props.renew;
      this.setState({ key, renew })
      const initialFetch = await fetch('http://localhost:3000/authenticate/renew', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          'renew_key': renew
        })
      })
      const renewSession = await initialFetch.json();
      const renewedKey = renewSession.api_key
      this.setState({ key: renewedKey })
      this.fetchUserList()
    } catch(error) {
      this.setState({ error })
      console.log('renew err', error)
    }
  }

  fetchUserList = async () => {
    console.log('fr')
    try {
      const key = this.state.key;
      console.log('key', key)
      const initialFetch = await fetch('http://localhost:3000/api/users?limit=9&page=1', {
        method: 'GET',
        headers: { 'Content-type': 'application/json',
                   'x-api-key': key }
      })
      const userList = await initialFetch.json();
      this.setState({ userList })
      console.log(this.state.userList)
    } catch(error) {
      this.setState({ error })
      console.log(error)
    }
  }

  renderUserList = () => {
    const { userList } = this.state;
    if(userList.data) {
      const user = userList.data.map((info, index) => {
        return (
          <div className='user' key={ index } id={ info.id }>
            <h6 className='user-name'>{ info.full_name }</h6>
            <h6 className='user-email'>{ info.email }</h6>
            <button name='button'>VIEW</button>
            <h6 className='user-survey-date'>{ info.survey_date }</h6>
          </div>
        )
      })
      return user
    }
  }

  render() {
    return (
      <div id='user-list'>
        <header id='user-list-header'>
          <img src={ require('../../assets/pairin-userlist-logo.png') } 
               alt='PAIRIN Company Logo' />
            <hr />
            <span id='pairin-span'>
              PAIRIN
              <h4>
                INFORM
              </h4>
            </span>
        </header>
        <div id='user-container'>
          <div id='sort-users'>
            <h6 id='name-label'>
              Name
              <img src={ require('../../assets/up-down-arrows.png')}/>
            </h6>
            <h6 id='email-label'>
              Email
              <img src={ require('../../assets/up-down-arrows.png')}/>
            </h6>
            <h6 id='survey-status-label'>
              Survey Status
              <img src={ require('../../assets/up-down-arrows.png')}/>
            </h6>
            <h6 id='survey-date-label'>
              Survey Date
              <img src={ require('../../assets/up-down-arrows.png')}/>
            </h6>
            <div id='render-user-list'>
              { this.renderUserList() }            
            </div>
          </div>
        </div>
      </div>
    )
  }
}

UserList.propTypes = {

}

export default UserList