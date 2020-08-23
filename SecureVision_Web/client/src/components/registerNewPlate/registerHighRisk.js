import React, {useState, Component} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Modal from '../material/modal'
import Snack from '../snackbar/snackbar'

const Axios = require('axios')

// Material component styling 
const useStyles = makeStyles(theme => ({
  root: {
    left: 0,
    zIndex: '100',
    height: 500,
    position: 'relative',
    width: '100%',
    flexGrow: 1,
    minWidth: 300,
    transform: 'translateZ(0)',
    // The position fixed scoping doesn't work in IE 11.
    // Disable this demo to preserve the others.
    '@media all and (-ms-high-contrast: none)': {
      display: 'none',
    },
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AAAAAA'
  },
  paper: {
    width: 900,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    backgroundColor: '#AAAAAA'
  },
  form:{
      padding: '15px',
      lineHeight: '20px',
      display: 'table'
  },
  label:{
      marginBottom: '10px',
  }
}));

const accentColor = '#1C63CD'
const primaryColor = '2D2D2D'

// modal to register a new high risk plate 
class RegisterModal extends Component{
  
  state = {
    name: '',
    type: '',
    plate: '',
    confirmPlate: '',
    showModal: false,
    showRegError: false,
    showSuccess: false 
  }

  // render the modal 
  showModal = () => {

    if(this.validateRegistry()){
      this.setState({showModal: true})
      this.setState({showRegError: false})
    }

    else{
      this.setState({showRegError: true})
    }
  }

  // try to submit the current info entered 
  submitHandler = () => {

        const id = JSON.parse(localStorage.getItem('userObj'))._id
        console.log(id)

        // check that information entered is valid so it can be posted to db 
        if(this.validateRegistry()){
          this.setState({showRegError: false})

          // submit to database on backend 
          let submit = Axios.post('/api/registration/highRiskRegistration',{
            name: this.state.name,
            type: this.state.type,
            plateNumber: this.state.plate,
            isActive: true ,
            id: id 
          }).catch((e) => console.log(e))
          
          console.log(submit)
        }
        console.log("User added")

        this.setState({showSuccess: true})
        this.setState({showModal: false, showRegError: false, name: '', type: '', plate: '', confirmPlate: ''})
    } 

    // changed text field information 
    nameChangeHandler = (event) => {
        this.setState({name: event.target.value}) 
    }

    typeChangeHandler = (event) => {
      this.setState({type: event.target.value})
    }

    plateChangeHandler = (event) => {
      this.setState({plate: event.target.value}) 
    }

    confirmPlateChangeHandler = (event) => {
      this.setState({confirmPlate: event.target.value})
    }

    // check that input fields are not blank and plate entries match 
    validateRegistry = () => {
        return((this.state.plate === this.state.confirmPlate) & (this.state.name !== "") & (this.state.type !== "") & (this.state.plate !== ""))
    }

    cancelHandler = () => {
      this.setState({showModal: false})
    }
    

  render(){
  
  console.log(this.props.schoolID)

  let errorSnack = this.state.showRegError ? <Snack activate={this.state.showRegError} message="Please enter valid registration"></Snack> : null
  let successSnack = this.state.showSuccess ? <Snack activate={true} message="Plate successfully added!"></Snack> : null

  const cellStyle = {
    marginTop: '10px',
    width: '400px',
    marginLeft: '5%'
  }

  const {classes} = this.props;

  const fieldStyle = {width: '100%', marginTop: '5px', marginBottom: '5px'}

  return (
    <div>
      <div style={{marginLeft: '25%'}}>
        <h1 id="server-modal-title" style={{float: 'left', marginLeft: '30px'}}>Register New High Risk</h1>
        <form style={{width: '500px'}}>
        <label className = {classes.label} style={cellStyle}>
            <TextField
            style={fieldStyle}
            value = {this.state.name}
            id="1"
            label="Name"
            variant="outlined"
            color={accentColor}
            onChange = {this.nameChangeHandler}
            />
        </label>
        <label className = {classes.label} style={cellStyle}>
            <TextField
              style={fieldStyle}
                value = {this.state.type}
                id="2"
                label="Threat Type"
                variant="outlined"
                color={accentColor}
                onChange = {this.typeChangeHandler}
            />
        </label>
        <label className = {classes.label} style={cellStyle}>
            <TextField
                style={fieldStyle}
                value = {this.state.plate}
                id="3"
                label="Plate number"
                variant="outlined"
                color={accentColor}
                onChange = {this.plateChangeHandler}
            />
        </label>
        <label className = {classes.label} style={cellStyle}>
            <TextField
                style={fieldStyle}
                value = {this.state.confirmPlate}
                id="4"
                label="Confirm plate number"
                variant="outlined"
                color={accentColor}
                onChange = {this.confirmPlateChangeHandler}
            />
        </label>
        <label className = {classes.label} style={cellStyle}>
            <Button variant = "outlined" onClick = {this.showModal} style={{float: 'left', marginLeft: '25px', marginTop: '20px', color: accentColor, border: accentColor, outline: accentColor, fontWeight: 550}}>
                Add user
            </Button>
            <Button variant = "outlined" onClick = {this.props.onReturn} style={{float: 'left', marginLeft: '5px', marginTop: '20px', color: accentColor, border: accentColor, outline: accentColor, fontWeight: 550}}>
                Cancel
            </Button>
        </label>
        </form>
        <Modal 
          shouldOpen={this.state.showModal}
          title="Confirm Registry">
            <p>Name: {this.state.name}</p>
            <p>Threat Type: {this.state.type}</p>
            <p>Plate Number: {this.state.plate}</p>
            <div>
              <Button variant = "outlined" onClick = {this.submitHandler} style={{marginTop: '20px', color: accentColor, border: accentColor, outline: accentColor, fontWeight: 550}}>
                  Confirm Add Plate
              </Button>
              <Button variant = "outlined" onClick = {this.cancelHandler} style={{marginTop: '20px', marginLeft: '20px', color: accentColor, border: accentColor, outline: accentColor, fontWeight: 550}}>
                  Cancel
              </Button>
            </div>
        </Modal>
        {errorSnack}
        {successSnack}
        </div>
    </div>
  )};
}

export default withStyles(useStyles)(RegisterModal)