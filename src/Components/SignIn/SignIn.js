import React, { Component } from 'react';
// import UserList from '../UserList/UserList'
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
  }

  validateInput = async () => {
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
        console.log('auth', authResponse)
        localStorage.setItem('signedIn', true)        
        this.setState({ authResponse, signedIn: true })
      } catch(error) {
        this.setState({ error })
      }
    }
    document.getElementById('email-input').value = '';
    document.getElementById('password-input').value = '';    
  }

  render() {
    return (
      <div>
        <header>
          <img src={ require('../../assets/pairin-logo.png') } 
               alt='PAIRIN Company Logo' />
                <span>
                  PAIRIN
                </span>
        </header>
        <div id='form-container'>
          <form>
            <h5 id='email-label'>
              Email Address
            </h5>
            <input type='email'
                   value={ this.state.email }
                   className='input'
                   id='email-input'
                   placeholder='email'
                   autoComplete='email'
                   autoFocus 
                   required 
                   onChange={ e => this.setState({ email: e.target.value })} 
            />
            <h5 id='password-label'>
              Password
            </h5>
            <input type='password'
                   value={ this.state.password }
                   id='password-input'
                   placeholder='password'
                   autoComplete='current-password'
                   required
                   onChange={ e => this.setState({ password: e.target.value })} 
            />
              <input type='submit'
                    value='SIGN IN'
                    id='sign-in-button'
                    onClick={ () => this.validateInput() }
              />
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;