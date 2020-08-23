import Modal from '../../material/modal'
import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

// logout confirmation modal 
class LogoutModal extends Component{

    // handle logout on backend 
    logout = () => {
        let logout = axios.get('/api/auth/logout')
        console.log(logout)
        // push / to dashboard to return to login page on frontend 
        this.props.history.push('/')
    }
    
    render(){
        return(
            <Modal 
                shouldOpen={this.props.open}> 
                <div style={{
                    textAlign: 'center',
                    marginTop: '15%'
                }}>
                    <h1>Confirm Logout</h1>
                    <div style={{display: 'flex', marginTop: '10%', fontSize: '18px', width: '100%', textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <Button style={{color: '#1C63CD', fontWeight: 550}} onClick={this.logout}>Logout</Button>
                        <Button style={{color: '#1C63CD', fontWeight: 550}} onClick={this.props.cancelLogout}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default withRouter(LogoutModal)