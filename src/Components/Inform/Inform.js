import React, { Component } from 'react';
import './Inform.css';
import PropTypes from 'prop-types';

class Inform extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: '',
      viewClicked: true,
      api_key: '',
      renew: '',
      userInfo: {},
      pageNotFound: false,
      error: ''
    }
  }

  componentDidMount() {
    this.renewSession();
  }
  
  renewSession = async () => {
    try {
      const api_key = this.props.api_key;
      const renew = this.props.renew;
      this.setState({ api_key, renew })
      const initialFetch = await fetch('http://localhost:3000/authenticate/renew', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          'renew_key': renew
        })
      })
      const renewSession = await initialFetch.json();
      const renewedKey = renewSession.api_key
      this.setState({ api_key: renewedKey })
      this.fetchUserInfo()
    } catch(error) {      
      this.setState({ error })
    }
  }

  fetchUserInfo = async () => {
    const { userId, api_key } = this.state;
    try {
      const initialFetch = await fetch(`http://localhost:3000/api/users/${userId}/info`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json',
                   'x-api-key': api_key }
      })
      const userInfo = await initialFetch.json();
      this.pageNotFound(userInfo)
      this.setState({ userInfo })
      console.log('i', userInfo)
    } catch(error) {
      this.setState({ error })
    }
  }

  pageNotFound = (userInfo) => {
    if(userInfo.code !== 200) {
      this.setState({ error: true })
    }
  }

  renderPageNotFound = () => {
    if(this.state.error) {
      return (
        <div id='page-not-found'>
          <header id='inform-header'>
          <img src={ require('../../assets/pairin-404-logo.png') } 
              alt='PAIRIN Company Logo' />
            <span id='inform-pairin-span'>
              PAIRIN
              <h4>
                PERSONAL
              </h4>
            </span> 
        </header>
        <section>
          <img src={ require('../../assets/exclamation-circle.png')} />
          <h1>404</h1>
          <h4>Page Not Found</h4>
        </section>
      </div>)   
    }
  }

  render() {
    return (
      <div>
        { this.renderPageNotFound() }
      </div>
    );
  }
}

Inform.propTypes = {

};

export default Inform;