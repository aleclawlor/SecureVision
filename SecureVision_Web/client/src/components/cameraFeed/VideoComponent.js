import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import Paper from '@material-ui/core/Paper'

// individual side-scroll video component for each camera feed
// TODO: make side scroll video components clickable so that main feed changes upon click 

class VideoComponent extends Component{

    state = {
        source: this.props.source,
        name: this.props.name,
        port: this.props.port,
    }

    render(){
        return(
            <div>
                <Paper style={{width: '300px', backgroundColor: '#F6F7F8'}}>
                    <ReactPlayer url={this.props.source} playing muted controls={false} width="300px" height="250px"/>
                    <div style={{marginBottom: '15px', transform: 'translate(0, -7px)'}}>
                        <h4 style={{color: '#000A40'}}>{this.state.name}</h4>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default VideoComponent