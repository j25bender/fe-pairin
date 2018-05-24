import React, { Component } from 'react';
import './Inform.css';

class Inform extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      name: '',
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
      const { api_key, renew, name, userId } = this.props;      
      this.setState({ api_key })
      const initialFetch = await fetch('http://localhost:3000/authenticate/renew', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          'renew_key': renew
        })
      })
      const renewSession = await initialFetch.json();
      const renewedKey = renewSession.api_key

      this.setState({ api_key: renewedKey, name, userId, renew })
      this.fetchUserInfo()      
    } catch(error) {
      this.props.handleSignIn({signedIn: false})     
      this.setState({ error })
    }
  }

  fetchUserInfo = async () => {
    const { api_key, userId } = this.state;
    try {
      const initialFetch = await fetch(`http://localhost:3000/api/users/${userId}/info`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json',
                   'x-api-key': api_key }
      })
      const userInfo = await initialFetch.json();
      this.pageNotFound(userInfo)
      this.setState({ userInfo })
    } catch(error) {
      this.setState({ error })
    }
  }

  pageNotFound = (userInfo) => {
    if(userInfo.code === 404) {
      this.setState({ error: true })
    }
  }

  renderPageNotFound = () => {
    if(this.state.error === true) {
      return (
        <div id='page-not-found'>
          <header id='inform-header'>
          <img src={ require('../../assets/pairin-404-logo.png') } 
               alt='PAIRIN Company Logo'
               id='not-found-logo' />
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

  renderHeader = () => {
    const { name } = this.state
    if(name) {
      return (
        <header id='inform-header-page-found'>
          <img src={ require('../../assets/pairin-logo.png') } 
               alt='PAIRIN Company Logo'
               id='logo' />
            <hr />
            <span id='pairin-span'>
              PAIRIN
              <h4>
                INFORM
              </h4>
            </span>
            <img src={ require('../../assets/right-arrow.png') }
                 alt='Right Arrow'
                 id='right-arrow' />
            <h2 id='inform-header-name'>{ name }</h2>
        </header>
      )
    }
  }

  renderMasthead = (quality = 'general') => {
    const { userInfo } = this.state;
    if(userInfo.qualities) {
      return (
        <section id='mastHead'>
          <svg id='quality-icon' viewBox="0 0 667 667">
            <use xlinkHref={ `${ userInfo.qualities[`${quality}`].icon }` } />
          </svg>
        </section>
      )
    }
  }

  render() {
    return (
      <div id='inform-component'>
        { this.renderPageNotFound() }
        { this.renderHeader() }
        { this.renderMasthead() }
      </div>
    );
  }
}

export default Inform;