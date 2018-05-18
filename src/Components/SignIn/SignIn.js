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
        <form>
          <h5>Email Address</h5>
          <input type='email' 
                 id='email-input' 
                 placeholder='email'
                 autoFocus 
                 required />
          <h5>Password</h5>
          <input type='password'
                 id='password-input' 
                 placeholder='password' 
                 required />
          <button id='sign-in-button' 
                  disabled >SIGN IN
          </button>
        </form>
      </div>
    );
  }
}

export default SignIn;