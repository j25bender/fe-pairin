import React, { Component } from 'react'
import './UserList.css'
import PropTypes from 'prop-types'

class UserList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userList: [],
      allUsers: [],
      error: '',
      api_key: '',
      renew: '',
      sortedAB: false
    }
  }

  componentDidMount() {
    console.log('props', this.props)
    // console.log(prevProps !== this.props)
      // this.fetchUserList();
      this.renewSession();
  }

  // checkSession = async () => {
  //   try {
  //     const api_key = this.props.key;
  //     console.log(api_key)
  //     const initialFetch = await fetch('/authenticate', {
  //       method: 'GET',
  //       headers: { 'Content-type': 'application/json',
  //                  'x-api-key': api_key }
  //     })
  //     const checkSession = await initialFetch.json();
  //     // this.setState({ userList })
  //     console.log('check session', checkSession )
  //   } catch(error) {
  //     this.setState({ error })
  //     console.log('check err', error)
  //   }
  // }

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
      // this.fetchUserList(1)
      this.fetchAllUsers(1)
    } catch(error) {
      this.setState({ error })
      console.log('renew err', error)
    }
  }

  fetchUserList = async (pageNum) => {
    try {
      const api_key = this.state.api_key;
      console.log('api_key', api_key)
      const initialFetch = await fetch(`http://localhost:3000/api/users?limit=9&page=${pageNum}`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json',
                   'x-api-key': api_key }
      })
      const userList = await initialFetch.json();    
      // this.setState({ userList })
      console.log(this.state.userList)
    } catch(error) {
      this.setState({ error })
      console.log(error)
    }
  }

  fetchAllUsers = async (pageNum) => {
    try {
      const api_key = this.state.api_key;
      console.log('api_key', api_key)
      const initialFetch = await fetch(`http://localhost:3000/api/users?limit=1000&page=${pageNum}`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json',
                   'x-api-key': api_key }
      })
      const allUsers = await initialFetch.json();
      // this.setState({ allUsers })
      this.convertDates(allUsers)
      console.log(this.state.allUsers)
    } catch(error) {
      this.setState({ error })
      console.log(error)
    }
  }

  renderUserList = () => {
    const { userList, allUsers } = this.state;
    if(allUsers) {
      const user = allUsers.map((info, index) => {
        return (
          <div className='user' key={ index } id={ info.id }>
            <h6 className='user-name'>{ info.full_name }</h6>
            <h6 className='user-email'>{ info.email }</h6>
            <button name='button'>VIEW</button>
            <h6 className='user-survey-date'>{ info.date }</h6>
          </div>
        )
      })
      return user
    }
  }

  sortAB = (className) => {
    let { allUsers, sortedAB } = this.state
    sortedAB = !sortedAB
    this.setState({ sortedAB })
    if(allUsers) {
      allUsers.sort((a, b) => {
        const nameEmailA = a[className].toUpperCase();
        const nameEmailB = b[className].toUpperCase();
        let comparison = 0
        if (nameEmailA < nameEmailB) {
          comparison = -1;
        } else if (nameEmailA > nameEmailB) {
          comparison = 1;
        } 
        return this.invertComparison(comparison) 
      })
    }
  }

  sortDates = (className) => {
      let { allUsers, sortedAB } = this.state
      sortedAB = !sortedAB
      this.setState({ sortedAB })
      if(allUsers) {
        allUsers.sort((a, b) => {
          const nameEmailA = a[className];
          const nameEmailB = b[className];
          let comparison = 0
          if (nameEmailA < nameEmailB) {
            comparison = -1;
          } else if (nameEmailA > nameEmailB) {
            comparison = 1;
          } 
          return this.invertComparison(comparison) 
        })
      }
    }

  invertComparison = (comparison) => {
    let { sortedAB } = this.state;
    if(sortedAB) {
      return comparison * -1
    } else if (!sortedAB) {
      return comparison
    }
  }

  convertDates = (allUsers) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    if(allUsers.data) {
      const updatedUsers = allUsers.data.reduce((accu, user, index) => {
        if(typeof user.survey_date === 'string') {
          const shortDate = user.survey_date.split(' ').slice(0, 1);
          const commaSepartedDate = shortDate.join().replace(/-/gi, ',');
          const newDateArr = commaSepartedDate.split(',')
          const event = new Date(Date.UTC(parseInt(newDateArr), 
                                          parseInt(newDateArr[1]), 
                                          parseInt(newDateArr[2])));
          const formatedDate = event.toLocaleDateString('en-US', options);
        
          const newObj = Object.assign({}, user, {date: formatedDate});
          accu.push(newObj)
          return accu
        }
        return accu
      }, [])
      this.setState({ allUsers: updatedUsers })
    }
  }

  render() {
    return (
      <div id='user-list'>
        <header id='user-list-header'>
          <img src={ require('../../assets/pairin-userlist-logo.png') } 
               alt='PAIRIN Company Logo' />
            <hr />
            <span id='pairin-span'>
              PAIRIN
              <h4>
                INFORM
              </h4>
            </span> 
        </header>
        <div id='user-container'>
          <div id='sort-users'>
              <h6 className='full_name' onClick={ (e) => this.sortAB(e.target.className) }>
                Name
                <img className='full_name' src={ require('../../assets/up-down-arrows.png')}/>
              </h6>
              <h6 className='email' onClick={ (e) => this.sortAB(e.target.className) }>
                Email
                <img className='email' src={ require('../../assets/up-down-arrows.png')}/>
              </h6>
              <h6 id='survey-status-label'>
                Survey Status
                <img src={ require('../../assets/up-down-arrows.png')}/>
              </h6>
              <h6 className='survey_date' onClick={ (e) => this.sortDates(e.target.className)}>
                Survey Date
                <img src={ require('../../assets/up-down-arrows.png')}/>
              </h6>
          </div>
          <div id='render-user-list'>
            { this.renderUserList() }            
          </div>
        </div>
        <div id='page-buttons'>
          <button name='prev'>PREV</button>
          <button name='next'>NEXT</button>
        </div>
      </div>
    )
  }
}

UserList.propTypes = {

}

export default UserList