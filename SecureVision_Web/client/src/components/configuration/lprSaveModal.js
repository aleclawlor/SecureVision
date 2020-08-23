import React, { Component } from 'react'
import Modal from '../material/modal'
import Button from '@material-ui/core/Button'

// modal for confirming that you want to save a configuration
class LprSaveModal extends Component{

    render(){
        return(
            <Modal shouldOpen={this.props.open}>
                <div>
                    <h2>Are you sure you want to save the current configuration?</h2>
                    <Button onClick={this.props.save}>Confirm</Button>
                    <Button onClick={this.props.cancel}>Cancel</Button>
                </div>
            </Modal>
        )
    }
}

export default LprSaveModal