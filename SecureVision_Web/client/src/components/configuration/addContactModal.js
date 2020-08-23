import React, { Component } from 'react'
import Modal from '../material/modal'
import Button from '@material-ui/core/Button'
import { TextField } from '@material-ui/core'
import Snack from '../snackbar/snackbar'

const Axios = require('axios')

const accentColor = '#1C63CD'

// modal to trigger when adding a new emergency contact 
class addContactModal extends Component{

    state = {
        number: '',
        name: ''
    }

    // submit newly added contact 
    handleFormSubmit = () => {

        // refresh error trigger 
        this.setState({errorSnack: null})
        const id = JSON.parse(localStorage.getItem('userObj'))._id

        // if a number or name is not provided, stop from adding to db 
        if(!this.state.number || !this.state.name){
            this.setState({errorSnack: <Snack activate={true} message="Please fill all input fields"/>})
            return 
        }

        // send the info to db if info is valid 
        let send = async() => {
            let req = await Axios.post('/api/contacts/addContacts', {
                number: this.state.number,
                name: this.state.name,
                id: id 
            })
        console.log(req)
    }
        send()

        // refresh data to show newly added contact and close the modal 
        this.props.refresh()
        this.setState({open: false})
        this.props.onClose()
    }

    // update the current info 
    updateNumber = (event) => {
        this.setState({number: event.target.value})
    }

    updateName = (event) => {
        this.setState({name: event.target.value})
    }

    triggerClose = () => {
        this.props.onClose()
    }

    render(){
        return(
            <Modal title="Register a new camera" shouldOpen={this.props.open}>
                <div style={{width: '50%', lineHeight: '65px'}}>
                    <TextField color={accentColor} label="Phone Number" style={{width: '100%'}} variant="outlined" value={this.state.number} onChange={this.updateNumber}></TextField>
                    <TextField color={accentColor} label="Name" style={{width: '100%'}} variant="outlined" value={this.state.name} onChange={this.updateName}></TextField>
                </div>
                <Button style={{color: accentColor, fontWeight: 550}} onClick = {() => {this.handleFormSubmit()}}>Submit</Button>
                <Button style={{color: accentColor, fontWeight: 550}} onClick = {() => {this.triggerClose()}}>Cancel</Button>
                {this.state.errorSnack}
            </Modal>
        )
    }
}

export default addContactModal