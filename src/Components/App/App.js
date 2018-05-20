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
      key: '',
      renew: ''
    }
  }

  componentDidMount() {
    const authResponse = localStorage.getItem('authResponse');    
    if(authResponse) {
      const parsedResponse = JSON.parse(authResponse)
      if(parsedResponse.status === "Success") {      
        const key = parsedResponse.api_key
        const renew = parsedResponse.renew_key      
        this.setState({ key, renew })
      }
    }
  }

  render() {
    return (
      <div className='App'>
        <Switch>
          <Route
            exact path='/'
            render={() => 
              this.state.key.length ? <Redirect to='/userlist' /> : <SignIn />
            }
          />
          <Route
            path='/userlist'
            render={() =>
              <UserList token={ this.state.key } renew={ this.state.renew } />
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
