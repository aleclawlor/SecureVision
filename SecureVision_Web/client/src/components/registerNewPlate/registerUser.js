import React, { Component } from 'react'
import RegisterParent from './registerParent'
import RegisterHighRisk from './registerHighRisk'
import { Paper, Button } from '@material-ui/core'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ErrorIcon from '@material-ui/icons/Error';

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'

// main user registry component 
class RegisterMain extends Component{

    state = {
        showRegisterFlow: false,
        addType: null,
    }

    // return callback passed to child modals; used to close the modal when new data is submitted
    onReturn = () => {
        this.setState({showRegisterFlow: false})
        this.setState({addType: null})
    }

    render(){
        
        console.log(this.props.schoolID)    

        const welcomeStyle = {textAlign: 'center'}
        const buttonStyle = {marginRight: '30px', marginTop: '70px', fontSize: '25px', textAlign: 'left', width: '50%', justifyContent: 'left', color: '#000A40'}

        let welcome = 
        <div style={welcomeStyle}>
                <Button style={buttonStyle} onClick={() => {this.setState({showRegisterFlow: true, addType: 'parent'})}}>
                    <PersonAddIcon style={{fontSize: '60px', marginRight: '20px', color: accentColor}}/>
                    <span style={{color: primaryColor, fontWeight: 550}}>Register a Parent Plate</span>
                </Button>
                <Button style={buttonStyle} onClick={() => {this.setState({showRegisterFlow: true, addType: 'highrisk'})}}>
                    <ErrorIcon style={{fontSize: '60px', marginRight: '20px', color: accentColor}}/>
                    <span style={{color: primaryColor, fontWeight: 550}}>Register a High Risk Plate</span>
                </Button>
        </div>

        let add = (this.state.addType == 'parent' && this.state.addType) ? <RegisterParent schoolID={this.props.schoolID} onReturn={this.onReturn}/> : <RegisterHighRisk schoolID={this.props.schoolID} onReturn={this.onReturn}/>
        let current = this.state.showRegisterFlow ? add : welcome

        return(
            <Paper style={{height: '650px', width: '100%', textAlign: 'center', backgroundColor: '#FAFAFA', paddingTop: '10%'}}>
                {current}
            </Paper>
        )
    }
}

export default RegisterMain