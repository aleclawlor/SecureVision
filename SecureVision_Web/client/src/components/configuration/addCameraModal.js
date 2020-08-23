import React, { Component } from 'react'
import Modal from '../material/modal'
import Button from '@material-ui/core/Button'
import { TextField } from '@material-ui/core'
import Snack from '../snackbar/snackbar'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import io from 'socket.io-client'

const Axios = require('axios')

const accentColor = '#1C63CD'

// modal to trigger when adding a new camera feed
class addCameraModal extends Component{

     // initialize a socket for webhooks
    // used to update what is rendered after a new license plate is found 
    // TODO: update with url of server on heroku 
    socket = io.connect('http://localhost:8000')

    state = {
        source: '',
        name: '',
        port: '',
        loading: true 
    }

    // submit function for when a user adds a new camrea to the database 
    handleFormSubmit = () => {

        // clear the 'error' snackbar 
        this.setState({errorSnack: null})

        // if the source, name, and/or port are not specified, trigger and error and don't add the camera
        if(!this.state.source || !this.state.name || !this.state.port){
            this.setState({errorSnack: <Snack activate={true} message="Please fill all input fields"/>})
            return  // return from function before adding the incomplete data to the database
        }

        const id = JSON.parse(localStorage.getItem('userObj'))._id

        // post added camera to db 
        let req = Axios.post('/api/cameras/registerCamera', {
            source: this.state.source,
            name: this.state.name,
            port: this.state.port,
            id: id 
        })
        
        // trigger the refresh callback to update shown cameras and include newly added one 
        this.props.refresh()

        // tell the python program that a new camera has been added
        // when the connection in python triggers, it sends a call to mongo to get the most recently added camera
        this.socket.emit('cameraAdded', ({
            state: this.state
        }))

        // close the camera add modal 
        this.setState({open: false})
        this.props.onClose()
    }

    // update entered info to component state 
    updateSource = (event) => {
        this.setState({source: event.target.value})
    }
    
    updateName = (event) => {
        this.setState({name: event.target.value})
    }

    updatePort = (event) => {
        this.setState({port: event.target.value})
    }

    triggerClose = () => {
        this.props.onClose()
    }

    render(){
        return(
            <Modal title="Register a new camera" shouldOpen={this.props.open}>
                <div style={{width: '50%', lineHeight: '65px', color: '#000A40'}}>
                    <TextField color={accentColor} label="IP Address" style={{width: '100%', fill: '#000A40'}} variant="outlined" value={this.state.source} onChange={this.updateSource}></TextField>
                    <TextField color={accentColor} label="Name" style={{width: '100%', color: '#000A40'}} variant="outlined" value={this.state.name} onChange={this.updateName}></TextField>
                    <TextField color={accentColor} label="Port" style={{width: '100%', color: '#000A40'}} variant="outlined" value={this.state.port} onChange={this.updatePort}></TextField>
                </div>
                <Button style={{color: accentColor, fontWeight: 550}} onClick = {() => {this.handleFormSubmit()}}>Submit</Button>
                <Button style={{color: accentColor, fontWeight: 550}} onClick = {() => {this.triggerClose()}}>Cancel</Button>
                {this.state.errorSnack}
            </Modal>
        )
    }
}

export default addCameraModal