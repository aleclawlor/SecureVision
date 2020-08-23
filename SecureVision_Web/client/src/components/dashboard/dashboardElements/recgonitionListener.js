import React, { Component } from 'react'
import Modal from '../../material/modal'

import io from 'socket.io-client'

// invisible component that sits in the sidebar and triggers a modal
// when a new high risk or unidentified plate 
class RecognitionListener extends Component{

    socket = io.connect('http://localhost:8000')

    state = {
        licensePlate: '',
        name: '',
        location: '',
        time: '',
        date: '',
        modalOpen: false,
    }

    componentDidMount(){

        this.socket.on('licensePlateRecognized', (data) => {
            
            console.log(data)

            if (!data.data){
                return 
            }

            console.log(data.data)
            const plateData = data.data.split('-')
            console.log(plateData)

            this.setState({
                modalOpen: true, 
                licensePlate: plateData[0],
                name: plateData[1],
                location: plateData[2],
                time: plateData[3],
                date: plateData[4]
            }, () => {
                setTimeout(() => {
                    this.setState({modalOpen: false})
                }, 8000)
            })
        })  
    }
    
    render(){
        return(
            <Modal shouldOpen={this.state.modalOpen}>
                <h1>License Plate Recognized</h1>
                <p>Plate Number: {this.state.licensePlate}</p>
                <p>Name: {this.state.name}</p>
                <p>Location: {this.state.location}</p>
                <p>Time: {this.state.time}</p>
                <p>Date: {this.state.date}</p>
            </Modal>
        )
    }
}

export default RecognitionListener