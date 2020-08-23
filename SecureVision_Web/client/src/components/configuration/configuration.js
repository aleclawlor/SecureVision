import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Modal from '../material/modal'
import { withRouter } from 'react-router'
import { Route } from 'react-router-dom' 

import CameraItem from './cameraItem'
import AddCameraModal from './addCameraModal'
import ContactItem from './contactItem'
import AddContactModal from './addContactModal'
import LprConfig from './lprConfig'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

const Axios = require('axios')

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'
const accentColor_secondary = '#FD663A'

const classes = {
    primaryButtonStyle: {
        color: accentColor,
        fontWeight: 550,
        border:'none', 
        width: '60%', 
        textAlign: 'left',
        marginBottom: '20px', 
        fontSize: '18px', 
        justifyContent: 'left', 
        marginLeft: '13.75%'
    }
}

// main configuration component (list show on initial config page)
class configurationBoard extends Component {

    state = {
        triggerAddCameraModal: false,
        triggerAddContactModal: false,
        showCameraModal: false,
        showContactsModal: false,
        camerasList: [],
        contactsList: [],
        loading: true 
    }

    // get all the data to be shown if needed 
    getCameras = async() => {
        let result = await Axios.get('/api/cameras/getCameras')
        console.log(result)
        this.setState({camerasList: result.data, loading: false})
    }

    getContacts = async() => {
        let result = await Axios.get('/api/contacts/getContacts')
        console.log(result)
        this.setState({contactsList: result.data, loading: false})
    }

    // handle the opening of camera configuartion or contact configuration modals 
    handleCameraModal = () => {
        let currentCamState = this.state.showCameraModal
        if(!currentCamState){
            this.getCameras()
        }
        this.setState({showCameraModal: !currentCamState, loading: true})
    }

    handleContactModal = () => {
        let currentCamState = this.state.showContactsModal
        if(!currentCamState){
            this.getContacts()
        }
        this.setState({showContactsModal: !currentCamState, loading: true})
    }

    // handle the user accessing the LPR Config page 
    promptLprConfig = () => {
        this.props.history.push('/dashboard/configuration/lprConfig')
    }

    // handle closing of modals 
    cameraOnClose = () => {
        this.setState({triggerAddCameraModal: false})
    }

    contactOnClose = () => {
        this.setState({triggerAddContactModal: false})
    }

    // refresh info from db; passed to children components to update with newly added information 
    refresh = async() => {
        let cameras= await Axios.get('/api/cameras/getCameras')
        this.setState({camerasList: cameras.data})

        let contacts = await Axios.get('/api/contacts/getContacts')
        this.setState({contactsList: contacts.data})

        this.setState({triggerAddCameraModal: false, triggerAddContactModal: false})
    }
    
    render(){
    
        const schoolID = JSON.parse(localStorage.getItem('userObj'))._id

        return(
            <div>
                <h2 style={{marginLeft: '15%', color: primaryColor, marginBottom: '50px'}}>Configuration Menu</h2>
                <div>
                    <div>
                        <Button style={classes.primaryButtonStyle} variant="outlined" onClick={() => {this.handleCameraModal()}}>
                            Configure Cameras
                        </Button>
                        <Button style={classes.primaryButtonStyle} variant="outlined" onClick={() => {this.handleContactModal()}}>
                            Configure emergency contacts
                        </Button>
                        <Button style={classes.primaryButtonStyle} variant="outlined" onClick={() => {this.promptLprConfig()}}>
                            Configure License Plate Recognition Area
                        </Button>
                        
                        {/*TODO: make the below code its own components to avoid the absolute disaster it is right now*/}

                        <Modal shouldOpen={this.state.showCameraModal} title="Current IP Cameras">
                            <div style={{width: '100%'}}>
                                <p style={{float: 'left', marginLeft:'0px'}}><strong>Source</strong></p>
                                <p style={{float: 'left', marginLeft:'130px'}}><strong>Name</strong></p>
                                <p style={{float: 'left', marginLeft:'95px'}}><strong>Port</strong></p>
                            </div>
                            <div style={{overflow: 'scroll', height: '55%', width: '100%'}}>
                                {this.state.loading ? 
                                <Loader style={{marginLeft: '30%'}} type="Rings" color={accentColor} secondaryColor={accentColor_secondary} height={200} width={200}
                                />
                                :
                                this.state.camerasList.map((d, i) => {
                                    if(d.isActive && d.schoolID === schoolID){
                                        return <CameraItem refresh={this.refresh} id={d._id} key={i} source={d.source} name={d.name} port={d.port}/>
                                    }
                                })}
                            </div>
                            <div style={{marginTop: '10px'}}>
                                <Button style={{color: accentColor, fontWeight: 550, outline: 'none'}} onClick={() => {this.setState({triggerAddCameraModal: true})}}>Add a new camera</Button>
                                <Button style={{color: accentColor, fontWeight: 550, outline: 'none'}} onClick={() => {this.handleCameraModal()}}>Cancel</Button>
                                <AddCameraModal refresh={this.refresh} open={this.state.triggerAddCameraModal} onClose={this.cameraOnClose}/>
                            </div>
                        </Modal>
                        <Modal shouldOpen={this.state.showContactsModal} title="Configure Emergency Contacts">
                        <div style={{width: '100%'}}>
                                <p style={{float: 'left', marginLeft:'0px'}}><strong>Phone Number</strong></p>
                                <p style={{float: 'left', marginLeft:'60px'}}><strong>Contact Name</strong></p>
                            </div>
                            <div style={{overflow: 'scroll', height: '55%', width: '100%'}}>
                                {this.state.loading ? 
                                <Loader style={{marginLeft: '30%'}} type="Rings" color="#000A40" secondaryColor="#F6F7F8" height={200} width={200}/>
                                :
                                this.state.contactsList.map((d, i) => {
                                    if(d.isActive && d.schoolID === schoolID){
                                        return <ContactItem refresh={this.refresh} id={d._id} key={i} number={d.number} name={d.name}/>
                                    }
                                })}
                            </div>
                            <div style={{marginTop: '10px'}}>
                                <Button style={{color: accentColor, fontWeight: 550, outline: 'none'}} onClick={()=>{this.setState({triggerAddContactModal: true})}}>Add Contact</Button>
                                <Button style={{color: accentColor, fontWeight: 550, outline: 'none'}} onClick={() => {this.handleContactModal()}}>Cancel</Button>
                                <AddContactModal refresh={this.refresh} open={this.state.triggerAddContactModal} onClose={this.contactOnClose}/>
                            </div>
                        </Modal>
                        <Route path="/lprConfig" component={LprConfig}/>
                    </div>
                </div>
            </div>
        )}
}

export default withRouter(configurationBoard)