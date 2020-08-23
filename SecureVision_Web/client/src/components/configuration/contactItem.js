import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Modal from '../material/modal'
import TextField from '@material-ui/core/TextField'

const Axios = require('axios')

const accentColor = '#1C63CD'

// contact item to display in contacts modal 
class ContactItem extends Component {

    state = {
        number: this.props.number,
        name: this.props.name,
        id: this.props.id,
        openEditModal: false,
        openDeactivateModal: false,
        editName: this.props.name,
        editNumber: this.props.number
    }

    // handle editing of contact item 
    handleEditModal = () => {
        this.setState({openEditModal: true})
    }

    // handle deactivation of contact 
    handleDeactivateModal = () => {
        this.setState({openDeactivateModal: true})
    }

    // handle modal close 
    close = () => {
        this.setState({openDeactivateModal: false, openEditModal: false})
        this.props.refresh()
    }

    // handle contact edit 
    editContact = async() => {
        const id = this.state.id
        let editItem = await Axios.put('/api/contacts/editContact', {
            id: id,
            name: this.state.editName,
            number: this.state.editNumber 
        })
        console.log(editItem)
        this.close()
    }

    // handle info changes for current contact 
    nameChange = (e) => {
        this.setState({editName: e.target.value})
    }

    numberChange = (e) => {
        this.setState({editNumber: e.target.value})
    }   

    // handle contact removal 
    removeContact = async() => {
        const id = this.state.id 
        console.log(id)

        let deactivate = await Axios.put('/api/contacts/deactivateContact', {
            id: id 
        })
        console.log(deactivate)
        this.close()
    }

    render(){

        let style ={
            width: '100%',
            color: '#000A40'
        }

        let btnStyle = {width: '100%', marginTop: '10px', marginBottom: '10px', color: accentColor}

        return(
            <div style={style}>
                <p style={{float: 'left', marginLeft: '0px', maxHeight: '20px', width:'90px',overflow: 'hidden'}}>{this.state.number}</p>
                <p style={{float: 'left', marginLeft: '70px', maxHeight: '20px', width:'150px', overflow: 'hidden'}}>{this.state.name}</p>
                <p style={{float: 'left', marginLeft: '35px', maxHeight: '20px', width: '60px',overflow: 'hidden'}}><Button style={{color: accentColor, transform: 'translate(0, -8px)', fontWeight: 550}} onClick={this.handleEditModal}>edit</Button></p>
                <p style={{float: 'left', marginLeft: '10px', maxHeight: '20px', marginLeft: '15px', width: '65px', overflow: 'hidden'}}><Button style={{color: accentColor, transform: 'translate(0, -8px)', fontWeight: 550}} onClick={this.handleDeactivateModal}>delete</Button></p>
                <Modal shouldOpen={this.state.openEditModal} style={{justifyContent: 'center'}}>
                    <TextField style={btnStyle} label="Number" variant="outlined" onChange={(e) => this.numberChange(e)} value={this.state.editNumber}></TextField>
                    <TextField style={btnStyle} label="Name" variant="outlined" onChange={(e) => this.nameChange(e)} value={this.state.editName}></TextField>
                    <Button style={{color: accentColor, outline: 'none', fontWeight: 550}} onClick={this.editContact}>Confirm Edit</Button>
                    <Button style={{color: accentColor, outline: 'none', fontWeight: 550}} onClick={this.close}>Cancel</Button>
                </Modal>
                <Modal shouldOpen={this.state.openDeactivateModal}>
                    <p>Are you sure you would like to delete this contact? Deleting the contact remove it from your contacts list permanently</p>
                    <Button style={{color: accentColor, outline: 'none', fontWeight: 550}} onClick = {this.removeContact}>Confirm Delete</Button>
                    <Button style={{color: accentColor, outline: 'none', fontWeight: 550}} onClick={this.close}>Cancel</Button>
                </Modal>
            </div>
        )
    }
}

export default ContactItem