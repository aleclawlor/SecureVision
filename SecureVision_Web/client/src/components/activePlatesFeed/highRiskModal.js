import React, { Component } from 'react'
import Modal from '../material/modal'
import Snack from '../snackbar/snackbar'
import Button from '@material-ui/core/Button'
import { TextField } from '@material-ui/core'

const Axios = require('axios')

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'

class myModal extends Component {

    state = {
        showEditModal: false, 
        showDeactivateModal: false,
        name: this.props.name,
        type: this.props.type,
        plateNumber: this.props.plateNumber,
        confirmPlate: this.props.plateNumber,
        oldName: this.props.name, 
        oldPlate: this.props.plateNumber,
        id: this.props.id,
        showSuccess: false,
        display: true
    }

    // define modal handlers for high risk plates
    handleEditModalClose = () => {
        this.setState({showEditModal: false})
    }
    
    handleDeactivateModalClose = () => {
        this.setState({showDeactivateModal: false})
    }

    editItemHandler = async() => {
        if(this.state.plateNumber === this.state.confirmPlate){
        // get currently selected item from database 
        let editItem = await Axios.put('/api/edit/editHighRisk', {
                id: this.state.id, 
                name: this.state.name,
                type: this.state.type,
                plateNumber: this.state.plateNumber
            })
        console.log(editItem)
        this.setState({
            showEditModal: false
        })
        this.setState({showSuccess: true, oldPlate: this.state.plateNumber, oldName: this.state.name})
        this.props.onSubmit()
    }
        else{
            console.log("Plates do not match")
        }
    }

    deactivatetemHandler = async() => {
        // get currently selected item from database
        let deactivate = await Axios.put('/api/edit/deactivateHighRisk', {
                id: this.state.id 
            })
        console.log(deactivate)
        this.setState({showDeactivateModal: false})
        this.setState({showSuccess: true})
        this.setState({display:false})

        this.props.onSubmit()
    }

    // changes in plate information handles
    nameChangeHandler = (event) => {
        this.setState({name: event.target.value}) 
    }

    typeChangeHandler = (event) => {
      this.setState({type: event.target.value})
    }

    plateChangeHandler = (event) => {
      this.setState({plateNumber: event.target.value}) 
    }

    confirmPlateChangeHandler = (event) => {
      this.setState({confirmPlate: event.target.value})
    }   

    render(){

    let successSnack = this.state.showSuccess ? <Snack activate={true} message="Plate successfully edited"></Snack> : null
    
    return(
        <div>
            <Modal 
            shouldOpen={this.props.showEditModal}
            title="Edit Plate">
                <div style={{display: 'flex'}}>
                    <div style={{float: 'left', width: '100px', fontSize: '16px', lineHeight: '42px'}}>
                        <p style={{width: '200px', display:'flex'}}>Name: </p>
                        <p style={{width: '200px', display:'flex'}}>Threat Type: </p>
                        <p style={{width: '200px', display:'flex'}}>Plate Number: </p>
                        <p style={{width: '200px', display:'flex'}}>Confirm Plate Number: </p>
                    </div>
                    <div style={{float: 'right', marginLeft: '20%'}}>
                        <TextField color={accentColor} style={{width: '100%', marginBottom: '4px'}} onChange = {this.nameChangeHandler} value={this.state.name} variant="outlined"></TextField>
                        <TextField color={accentColor} style={{width: '100%', marginBottom: '4px'}} onChange = {this.typeChangeHandler} value={this.state.type} variant="outlined"></TextField>
                        <TextField color={accentColor} style={{width: '100%', marginBottom: '4px'}} onChange = {this.plateChangeHandler} value={this.state.plateNumber} variant="outlined"></TextField>
                        <TextField color={accentColor} style={{width: '100%', marginBottom: '4px'}} onChange = {this.confirmPlateChangeHandler} value={this.state.confirmPlate} variant="outlined"></TextField>
                    </div>
                </div>
                <div>
                    <Button variant = "outlined" onClick = {this.editItemHandler} style={{marginTop: '0px', color: accentColor, border: accentColor, outline: accentColor, fontWeight: 550}}>
                        Confirm Edit
                    </Button>
                    <Button variant = "outlined" onClick = {this.props.onCancel} style={{marginTop: '0px', marginLeft: '20px', color: accentColor, border: accentColor, outline: accentColor, fontWeight: 550}}>
                        Cancel
                    </Button>
                </div>
            </Modal>
            <Modal 
            shouldOpen={this.props.showDeactivateModal}
            title="Confirm Deactivation">
                <p>Are you sure you wish to deactivate this plate? Deactivation means cameras will no longer recognize this plate, and it will be removed from the 'active plates' section. Please confirm this action.</p>
                <div>
                    <Button variant = "outlined" onClick = {this.deactivatetemHandler} style={{marginTop: '20px', color: accentColor, border: accentColor, outline: accentColor, fontWeight: 550}}>
                        Confirm Deactivation
                    </Button>
                    <Button variant = "outlined" onClick = {this.props.onCancel} style={{marginTop: '20px', marginLeft: '20px', color: accentColor, border: accentColor, outline: accentColor, fontWeight: 550}}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        {successSnack}
        </div>
    )}
}

export default myModal