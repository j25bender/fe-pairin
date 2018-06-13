import React, { Component } from 'react';
import './SignIn.css';

export class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      authResponse: {},
      signedIn: false
    }
    this.updateValue = this.updateValue.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  validateInput = async (e) => {
    e.preventDefault()
    const { email, password } = this.state;
    if(email.length && password.length) {
      try {
        const initialFetch = await fetch('/authenticate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "username": email,
            "password": password
          })
        })
        const authResponse = await initialFetch.json();
        localStorage.setItem('authResponse', JSON.stringify(authResponse))
        this.setState({ authResponse, signedIn: true, email: '', password: '' })
        this.props.handleSignIn({signedIn: true}, authResponse)
        localStorage.setItem('signedIn', true)        
        
      } catch(error) {
        this.setState({ error })
      }
    }
  }

  updateValue(e) {
    const name = e.target.name;
    this.setState({ [name]: e.target.value })
  }

  render() {
    return (
      <div>
        <header id='sigin-header'>
          <img src={ require('../../assets/pairin-logo.png') } 
               alt='PAIRIN Company Logo' />
                <span id='pairin'>
                  PAIRIN
                </span>
        </header>
        <div id='form-container'>
          <form onSubmit={ this.validateInput }>
            <h5 id='email-label'>
              Email Address
            </h5>
            <input name='email'
                   value={ this.state.email }
                   className='input'
                   id='email-input'
                   placeholder='email'
                   autoComplete='email'
                   autoFocus 
                   onChange={ this.updateValue } 
            />
            <h5 id='password-label'>
              Password
            </h5>
            <input name='password'
                   type='password'
                   value={ this.state.password }
                   id='password-input'
                   placeholder='password'
                   autoComplete='current-password'
                   onChange={ this.updateValue }
            />
            <input type='submit'
                   value='SIGN IN'
                   id='sign-in-button'
            />
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;