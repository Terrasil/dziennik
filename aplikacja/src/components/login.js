import React, { useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../img/logo.png'
/*
class Login extends Component {
  state = {
    credentials: {username: '', password: ''}
  }

  login = event => {
    fetch('http://localhost:8000/auth/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state.credentials)
      
    })
    .then( data => data.json())
    .then(
      data => {
        console.log(data.token);
        this.props.userLogin(data.token);
      }
    )
    .catch( error => console.error(error))
  }

  register = event => {
    fetch('http://localhost:8000/api/users/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state.credentials)
    })
    .then( data => data.json())
    .then(
      data => {
        console.log(data.token);
      }
    )
    .catch( error => console.error(error))
  }
  inputChanged = event => {
    const cred = this.state.credentials;
    cred[event.target.name] = event.target.value;
    this.setState({credentials: cred});
  }
 

  render() {
    return (
      <div>
        <h1>Login user form</h1>

        <label>
          Username:
          <input type="text" name="username"
           value={this.state.credentials.username}
           onChange={this.inputChanged}/>
        </label>
        <br/>
        <label>
          Password:
          <input type="password" name="password"
           value={this.state.credentials.password}
           onChange={this.inputChanged} />
        </label>
        <br/>
        <button onClick={this.login}>Login</button>
        <button onClick={this.register}>Register</button>
      </div>
    );
  }
}*/
const Login = () => {

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    // Check and see if errors exist, and remove them from the error object
    if ( !!errors[field] ) setErrors({
      ...errors,
      [field]: null
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const newErrors = findFormErrors()
    
    this.props.userLogin('testowy-token');
    // Set errors messages into control feedbacks
    if ( Object.keys(newErrors).length > 0 ) {
      setErrors(newErrors)
      // Invadlidated
      return false
    } else {
      // Vadlidated
      return true
    }
  }

  // Form validation
  const findFormErrors = () => {
    const { login, password } = form
    const newErrors = {}
    // Login errors
    if ( !login || login === '' ) newErrors.login = 'Podaj adres email!'
    // Password errors
    // Login errors
    if ( !password || password === '' ) newErrors.password = 'Podaj hasło!'
    // Password errors

    return newErrors
  }

  return (
    <div className="container h-100">
      <div className="row h-100 justify-content-center align-items-center">
        <Form className="col-md-6">
          <Form.Group className="text-center">
            <Image src={Logo} style={{border: 'none'}} thumbnail />
          </Form.Group>
          <Form.Group>
            <Form.Label>Adres Email</Form.Label>
            <Form.Control 
              type='text' 
              onChange={ e => setField('login', e.target.value) }
              isInvalid={ !!errors.login }
            />
            <Form.Control.Feedback type='invalid'>{ errors.login }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Hasło</Form.Label>
            <Form.Control 
              type='password' 
              onChange={ e => setField('password', e.target.value) }
              isInvalid={ !!errors.password }
            />
            <Form.Control.Feedback type='invalid'>{ errors.password }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Check type="checkbox" label="Zapamiętaj mnie!"/>
          </Form.Group>
          <Form.Group className="text-center">
            <Button className="rounded-pill px-5" type='submit' onClick={ handleSubmit }>Zaloguj</Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

export default Login;
