import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import UserList from '../UserList/UserList';
// import Inform from '../Inform/Inform';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      signedIn: false,
      key: '',
      renew: ''
    }
  }

  componentDidMount() {
    const signedIn = localStorage.getItem('signedIn')
    if(signedIn) {
      const authResponse = localStorage.getItem('authResponse');    
      const parsedResponse = JSON.parse(authResponse)
      if(parsedResponse.status === "Success") {  
        const key = parsedResponse.api_key
        const renew = parsedResponse.renew_key    
        this.setState({ signedIn, key, renew })
        console.log('app state', this.state)
      }
    }
  }

  signedInCheck = () => {
    console.log('hey')
    const signedIn = localStorage.getItem('signedIn')
    if(signedIn && signedIn !== this.state.signedIn) {
      console.log('si')
      this.setState({ signedIn }) 
    }
  }

  render() {
    { this.signedInCheck() }
    return (
      <div className='App'>
        <Switch>
          <Route
            exact path='/'
            render={() => 
              this.state.signedIn ? <Redirect to='/userlist' /> : <SignIn />
            }
          />
          <Route
            path='/userlist'
            render={() =>
              <UserList signedIn={ this.state.signedIn}
                        key={ this.state.key } 
                        renew={ this.state.renew } />
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

export default App;
