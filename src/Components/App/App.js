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
      key: ''
    }
  }

  componentDidMount() {
    const authResponse = localStorage.getItem('authResponse');
    const parsedResponse = JSON.parse(authResponse)
    if(authResponse.length && parsedResponse.status === "Success") {      
      const key = parsedResponse.api_key
      this.setState({ key })
    }
  }

  render() {
    return (
      <div className='App'>
        <Switch>
          <Route
            exact path='/'
            render={() => 
              this.state.key ? <Redirect to='/userlist' /> : <SignIn />
            }
          />
          <Route
            path='/userlist'
            render={() =>
              <UserList token={ this.state.key } />
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
