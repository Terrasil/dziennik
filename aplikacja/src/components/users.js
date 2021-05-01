import React, { Component } from 'react';

class Users extends Component {

  state = {
    users: []
  }

  loadUsers = () => {
    fetch('http://localhost:8000/api/users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${this.props.csrftoken}`
      }
    })
    .then( data => data.json())
    .then(
      data => {
        if(data.detail){
          this.setState({users: []})
        }else{
          this.setState({users: data})
        }
      }
    )
    .catch( error => console.error(error))
  }

  render() {
    return (
      <div>
        <h1>Users list</h1>
        { this.state.users?.map( user => {
          return <h3 key={user.id}>{user.email}</h3>
        })}
        <button onClick={this.loadUsers}>Load Users</button>
      </div>
    );
  }
}

export default Users;
