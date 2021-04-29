import React, { Component} from 'react';

class Users extends Component {

  state = {
    users: []
  }

  loadUsers = () => {
    fetch('http://localhost:8000/api/users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${this.props.token}`
      },
      body: JSON.stringify(this.state.credentials)
    })
    .then( data => data.json())
    .then(
      data => {
        this.setState({users: data})
      }
    )
    .catch( error => console.error(error))
  }

  render() {
    return (
      <div>
        <h1>Users</h1>
        { this.state.users.map( book => {
          return <h3 key={book.id}>{book.username}</h3>
        })}
        <button onClick={this.loadUsers}>Load Users</button>
      </div>
    );
  }
}

export default Users;
