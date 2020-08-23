import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Modal from '../material/modal'
import TextField from '@material-ui/core/TextField'

const Axios = require('axios')

const accentColor = '#1C63CD'

// camera item shown in the list of current cameras for the school 
class CameraItem extends Component {

    state = {
        source: this.props.source,
        name: this.props.name,
        port: this.props.port,
        id: this.props.id,
        editSource: this.props.source,
        editName: this.props.name,
        editPort: this.props.port,
        openDeactivateModal: false,
        openEditModal: false 
    }

    close = () => {
        this.setState({openDeactivateModal: false, openEditModal: false})
        this.props.refresh()
    }

    // edit the current item 
    edit = async() => {
        let editedCamera = await Axios.put('/api/cameras/editCamera', {
            id: this.state.id,
            source: this.state.editSource,
            name: this.state.editName,
            port: this.state.editPort
        })
        console.log(editedCamera)
        this.close()
    }

    // deactivate the current item 
    deactivate = async() => {
        let deactivate = await Axios.put('/api/cameras/deactivateCamera', {
            id: this.state.id
        })
        console.log(deactivate)
        this.close()
    }

    // handle information changes 
    sourceChange = (d) => {
        this.setState({editSource: d.target.value})
    }

    nameChange = (d) => {
        this.setState({editName: d.target.value})
    }

    portChange = (d) => {
        this.setState({editPort: d.target.value})
    }

    handleEdit = () => {
        this.setState({openEditModal: true})
    }

    handleDelete = () => {
        this.setState({openDeactivateModal: true})
    }

    render(){

        let style = {
            width: '100%',
            display: 'flex'
        }

        let btnStyle = {width: '100%', marginTop: '10px', marginBottom: '10px', color: accentColor}

        return(
            <div style={style}>
                <p style={{float: 'left', marginLeft: '0px', maxHeight: '20px',width:'150px',overflow: 'hidden'}}>{this.state.source}</p>
                <p style={{float: 'left', marginLeft: '30px', maxHeight: '20px', width:'90px', overflow: 'hidden'}}>{this.state.name}</p>
                <p style={{float: 'left', marginLeft: '40px', maxHeight: '20px' ,width:'35px', overflow: 'hidden'}}>{this.state.port}</p>
                <p style={{float: 'left', marginLeft: '35px', maxHeight: '20px' ,width: '60px', overflow: 'hidden'}}><Button style={{color: accentColor, height: '100%', transform: 'translate(0, -2px)', fontWeight: 550}} onClick={() => {this.handleEdit()}}>edit</Button></p>
                <p style={{float: 'left', marginLeft: '10px', maxHeight: '20px',marginLeft: '15px', width: '65px', overflow: 'hidden'}}><Button style={{color: accentColor, height: '100%', transform: 'translate(0, -2px)', fontWeight: 550}} onClick={() => {this.handleDelete()}}>delete</Button></p>
                <Modal shouldOpen={this.state.openEditModal}>
                <TextField style={btnStyle} label="Source" variant="outlined" onChange={(e) => this.sourceChange(e)} value={this.state.editSource}></TextField>
                <TextField style={btnStyle} label="Name" variant="outlined" onChange={(e) => this.nameChange(e)} value={this.state.editName}></TextField>
                <TextField style={btnStyle} label="Port" variant="outlined" onChange={(e) => this.portChange(e)} value={this.state.editPort}></TextField>
                    <Button style={{color: accentColor, outline: 'none', fontWeight: 550}} onClick={this.edit}>Confirm Edit</Button>
                    <Button style={{color: accentColor, outline: 'none', fontWeight: 550}} onClick={this.close}>Cancel</Button>
                </Modal>
                <Modal shouldOpen={this.state.openDeactivateModal}>
                    <p>Are you sure you want to delete this camera? Removing the camera will permamently delete it from your camera feed.</p>
                    <Button style={{color: accentColor, outline: 'none', fontWeight: 550}} onClick={this.deactivate}>Confirm Delete</Button>
                    <Button style={{color: accentColor, outline: 'none', fontWeight: 550}} onClick={this.close}>Cancel</Button>
                </Modal>
            </div>
        )
    }
}

export default CameraItem