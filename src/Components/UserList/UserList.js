import React, { Component } from 'react'
import './UserList.css'

class UserList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      allUsers: [],
      error: '',
      api_key: '',
      renew: '',
      sortedAB: false
    }
  }

  componentDidMount() {
      this.renewSession();
  }

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
      this.fetchAllUsers(1)
    } catch(error) {
      this.props.handleSignIn({signedIn: false})
      this.setState({ error })
    }
  }

  fetchUserList = async (pageNum) => {
    try {
      const api_key = this.state.api_key;
      const initialFetch = await fetch(`http://localhost:3000/api/users?limit=9&page=${pageNum}`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json',
                   'x-api-key': api_key }
      })
      const userList = await initialFetch.json();    
      this.convertDates(userList)
    } catch(error) {
      this.setState({ error })
    }
  }

  fetchAllUsers = async (pageNum) => {
    try {
      const api_key = this.state.api_key;
      const initialFetch = await fetch(`http://localhost:3000/api/users?limit=1000&page=${pageNum}`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json',
                   'x-api-key': api_key }
      })
      const allUsers = await initialFetch.json();
      this.convertDates(allUsers)
    } catch(error) {
      this.setState({ error })
    }
  }

  sortAB = (className) => {
    let { allUsers, sortedAB } = this.state
    sortedAB = !sortedAB
    this.setState({ sortedAB })
    if(allUsers.data) {
      allUsers.data.sort((a, b) => {
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
    if(allUsers.data) {
      allUsers.data.sort((a, b) => {
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
        
          const newObj = Object.assign({}, user, {formatedDate: formatedDate});
          accu.push(newObj)
          return accu
        }
        return accu
      }, [])
      const addDataKey = Object.assign({}, {data: updatedUsers})
      this.setState({ allUsers: addDataKey })
    }
  }

  handleViewClick = (userId, name) => {
    const viewClicked = true;
    this.props.viewClick(viewClicked, userId, name);
  }

  handlePageClick = (id) => {
    const pageNum = parseInt(id);
    this.fetchUserList(pageNum);
  }

  renderPageButtons = () => {
    return (
      <ul id='button-group'>
        <li><a id='prev'>PREV</a></li>
        <li><a className='pageNum' id='1' onClick={(e) => this.handlePageClick(e.target.id)}>1</a></li>
        <li><a className='pageNum' id='2' onClick={(e) => this.handlePageClick(e.target.id)}>2</a></li>
        <li><a className='pageNum' id='3' onClick={(e) => this.handlePageClick(e.target.id)}>3</a></li>
        <li><a className='pageNum' id='4' onClick={(e) => this.handlePageClick(e.target.id)}>4</a></li>
        <li><a id='next'>NEXT</a></li>
      </ul>
    )
  }

  renderUserList = () => {
    const { allUsers } = this.state;
    if(allUsers.data) {      
      const user = allUsers.data.map((info, index) => {
        const name = info.full_name
        const userId = info.id
        return (
          <div className='user' 
               key={ index }
               id={ info.id }
               onClick={() => this.handleViewClick(userId, name)}>
            <h6 className='user-name'>{ info.full_name }</h6>
            <h6 className='user-email'>{ info.email }</h6>
            <button name='button'>VIEW</button>
            <h6 className='user-survey-date'>{ info.formatedDate }</h6>
          </div>
        )
      })
      return user
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
          { this.renderPageButtons() }
        </div>
      </div>
    )
  }
}

export default UserList