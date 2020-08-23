import React, { Component } from 'react';
import LoginScreen from './components/login/login'
import Dashboard from './components/dashboard/dashboard'
import Register from './components/register/register'
import ls from 'local-storage'
import {Route, BrowserRouter, Redirect} from 'react-router-dom'

class App extends Component {

  state = {
    userObj: null
  }
  
  setUser = (data) => {
    this.setState({userObj: data.data.user}, () => {
      localStorage.setItem('userObj', JSON.stringify(this.state.userObj))
    })
  }

  render () {
    return (
      <div>
        <BrowserRouter>
            <Route path="/" exact component={() => <LoginScreen setUser={this.setUser}/>}/>
            <Route path="/dashboard" component={() => <Dashboard user={this.state.userObj}/>}/>
            <Route path="/register" component={Register}/>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;