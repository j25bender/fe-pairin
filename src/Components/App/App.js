import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import UserList from '../UserList/UserList';
// import Inform from '../Inform/Inform';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      signedIn: false,
      api_key: '',
      renew: ''
    }
  }

  componentDidMount() {
    const signedIn = localStorage.getItem('signedIn')
    if(signedIn) {
      const authResponse = localStorage.getItem('authResponse');    
      const parsedResponse = JSON.parse(authResponse)
      if(parsedResponse.status === "Success") {  
        const api_key = parsedResponse.api_key
        const renew = parsedResponse.renew_key    
        this.setState({ signedIn, api_key, renew })
        console.log('app state', this.state)
      }
    }
  }

  handleSignIn = (signedIn, authResponse) => {
    const {api_key, renew_key} = authResponse
    this.setState({signedIn, api_key, renew: renew_key})
  }

  render() {
    // { this.signedInCheck() }
    return (
      <div className='App'>
        <Switch>
          <Route
            exact path='/'
            render={() => 
              this.state.signedIn ? <Redirect to='/userlist' /> : <SignIn handleSignIn= { this.handleSignIn }/>
            }
          />
          <Route
            path='/userlist'
            render={() =>
              this.state.signedIn ? <UserList signedIn={ this.state.signedIn }
                        api_key={ this.state.api_key } 
                        renew={ this.state.renew } /> : <SignIn />
            }
          />
          {/* <Route
            path='/inform'
            render={() =>
              // this.props.loggedIn ? <Redirect to='/' /> : <Login />
              <Inform />
            }
          /> */}
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
