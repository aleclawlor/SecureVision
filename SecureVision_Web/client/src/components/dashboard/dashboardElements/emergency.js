import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import Modal from '../../material/modal'

const Axios = require('axios')

let style = {
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%'
}

const accentColor = '#1C63CD'

// emergency contacts modal 
class emergencySection extends Component{

    state = {
        openContacts: this.props.shouldOpen,
        contacts: []
    }
    
    // get contacts when component is mounted
    componentDidMount(){
        this.getContacts()
    }

    // function to retrieve contacts from db 
    getContacts = async() => {

        let result = await Axios.get('/api/contacts/getContacts')
        console.log(result)
        this.setState({contacts: result.data})
    }

    // make a phone call to the currently selected contact 
    makeCall = (number) => {
        console.log(number)
        // Axios.post('/api/phone/makeCall', {
        //     number: number 
        // })
    }

    render(){

        const schoolID = JSON.parse(localStorage.getItem('userObj'))._id

        return(
            <div style={style}>
                <Modal shouldOpen={this.props.shouldOpen} title="Emergency Contacts" style={{zIndex: 5000, backgroundColor: '#EFEFEF'}}>
                    <div style={{width: '100%', height: '70%', marginTop: '5%', textAlign: 'center', justifyContent: 'center', overflow: 'scroll'}}>
                    {this.state.contacts.map((d, i) => {
                        if(d.isActive && d.schoolID === schoolID){  // only render contacts with school-specific ID 
                            let number = d.number
                            return <Button key={i} onClick={() => this.makeCall(number)} style={{fontSize:'20px', width: '100%', textTransform: 'capitalize'}}>{d.name}</Button>
                        }
                    })}
                    </div>
                    <Button style={{fontWeight: 550, color: accentColor}} onClick={() => {this.props.close()}}>Cancel</Button>
                </Modal>
            </div>
        )}
}

export default emergencySection