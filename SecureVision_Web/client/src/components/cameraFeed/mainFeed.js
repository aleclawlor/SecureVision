import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { Button } from '@material-ui/core'

const Axios = require('axios')

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'

// styling for camera components
// TODO: combine to one class 

const player = {
    marginTop: '5px'
}

const buttonGridStyle={
    width: '100%',
    textAlign:'left',
    overflow: 'scroll'
}

const buttons = {
    marginLeft: '15px', 
    width: '102%',
    color: primaryColor,
    overflow: 'hidden',
    fontWeight: 550
}

// component to hold the primary video being shown 
class MainFeed extends Component{

  state = {
          source: this.props.source,
          name: this.props.name,
          port: this.props.port,
          buttonNames: this.props.buttonNames,
          finished: false,
          source: 'https://www.youtube.com/embed/OOPWzhFnCZg',  // TODO: change to first camera in cameras list from DB 
          header: 'Default Feed'
    }  

    // change the camera feed shown in the primary camera box 
    handleChange = (name, source) => {
      this.setState({header: name, source: source})
    }

    // once the component mounts, get all the school-specific cameras from the DB 
    componentDidMount(){
        
        const getCameras = async() => {

          const schoolID = JSON.parse(localStorage.getItem('userObj'))._id
          
          let result = await Axios.get('/api/cameras/getCameras')
          this.setState({buttonNames: result.data.map((d, i) => {
            if(d.isActive && d.schoolID === schoolID){
              return <Button key={i} onClick={() => {this.handleChange(d.name, d.source)}} style={{height: '80px', color: primaryColor, fontWeight: 550}}>{d.name}</Button>
            }
          })})
      }

    getCameras()

    }

    render(){

        return(
            <div>
                <div style={{width: '700px', height: '420px', backgroundColor: '#F6F7F8'}}>
                    <ReactPlayer url={this.state.source} playing muted controls={false} className={player} width="100%" height="100%"/>
                    <div style={{marginTop: '15px'}}>
                        <h1 style={{marginLeft: '15px', color: primaryColor}}>{this.state.header}</h1>
                    </div>
                    <div style={buttonGridStyle}>
                        <div style={buttons}>
                            {this.state.buttonNames.map((d) => {
                              return d
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainFeed