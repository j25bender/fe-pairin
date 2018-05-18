import React, { Component } from 'react';
import './SignIn.css';

export class SignIn extends Component {
  render() {
    return (
      <div>
        <header>
          <img src={require('../../assets/pairin-logo.png')} 
               alt='PAIRIN Company Logo' />
                <span>
                  PAIRIN
                </span>
        </header>
        <div id='form-container'>
          <form>
            <h5 id='email-label'>Email Address</h5>
            <input type='email' 
                  id='email-input' 
                  placeholder='email'
                  autoFocus 
                  required />
            <h5 id='password-label'>Password</h5>
            <input type='password'
                  id='password-input' 
                  placeholder='password' 
                  required />
            <input type='button'
                   value='SIGN IN'
                   id='sign-in-button' 
                   disabled
            />
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;