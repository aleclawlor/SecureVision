import React, { Component, createRef } from 'react'
import Button from '@material-ui/core/Button'
import ReactPlayer from 'react-player'
import Axios from 'axios'
import SaveModal from './lprSaveModal'

const classes = {
    returnArrow: {
        fontSize: '40px',
        position: 'absolute',
        marginTop: '30px'
    },
    buttonsArea: {
        width: '100%',
        overflow: 'scroll',
        height: '80px',
        marginTop: '30px'
    },
    canvasArea: {
        width: '80%',
        height: '400px',
        display: 'flex',
        // backgroundColor: '#333',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: '5px'
    },
    canvas: {
        backgroundColor: 'rgba(0, 0, 0, .1)',
        position: 'absolute',
        zIndex: '20',
        width: '640px',
        height: '360px'
    },
    buttonStyling: {
        marginLeft: '20px',
        marginRight: '20px'
    },
    configButtons: {
        width: '20%',
        height: '100%',
        textAlign: 'left',
        marginLeft: '250px',
        marginLeft: '80%'
    }
}

// component to update which areas of a video are 'fair game' for license plate recongition
// necessary for school customization and cases in which default configuration might not cover the entire necessary area 
// area selection can help performance and tailor the product to specific school cameras rather than a one-size-fits-all solution
class LprConfig extends Component{

    canvasWidth = 200
    canvasHeight = 200

    state = {
        currentSource: null,
        promptSave: false, 
        camerasList: null,
        videoSource: null,
        initialPointsObject: {
            x0: 0,
            y0: 0,
            width: 0,
            height: 0
        },
        currentPointsObject: {
            x0: 0,
            y0: 0, 
            width: 0, 
            height: 0
        },
        playing: false,
        currentCameraID: null  
    }

    // create references for html canvas 
    canvasRef = createRef() 
    videoRef = createRef()

    // get the cameras from the database  
    refresh = () => {

        Axios.get('/api/cameras/getCameras').then(
            data => {
                // set the retrieved cameras to state variable 
                this.setState({camerasList: data.data.filter(d => {
                    console.log(d)
                    return d.isActive
                    }), 
                    promptSave: false})
            }
        )
    }

    // when the component is mounted, set the initial configuration selection to the first camera in the camera list 
    componentDidMount(){

        let source 

        Axios.get('/api/cameras/getCameras')
        .then(data => {

            source = data.data[0].source

            this.setState({camerasList: data.data.filter(d => d.isActive), currentSource: data.data[0].source, playing: true})
            console.log(data)
        }).catch(err => {
            console.log(err)
        })
    }

    // called when html canvas is updated 
    componentDidUpdate(){

        // use html canvas to update the current configuration for a camera 
        const canvas = this.canvasRef.current
        canvas.addEventListener('mousedown', (e) => console.log(e))

        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = 'red'

        const canvasWidth = canvas.width  
        this.canvasWidth = canvasWidth

        const canvasHeight = canvas.height

        // clear the previously drawn area so that the rectangle area moves 
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.fill()

        let {x0, y0, width, height} = this.state.currentPointsObject
        let vid = document.getElementById('vid')
        
        // ctx.drawImage(vid, 0, 0, canvasWidth, canvasHeight)
        ctx.strokeRect(x0, y0, width, height)
        ctx.save()
    }

    // post current configutration for a camera to database 
    submitConfiguration = () => {

        // get the current points object
        const pts = this.state.currentPointsObject
        console.log(pts)

        // update the configuration for a specific camera
        Axios.put('/api/cameras/updateConfigurationArea', {
            id: this.state.currentCameraID,
            x0: pts.x0,
            y0: pts.y0,
            x1: pts.x0 + pts.width,
            y1: pts.y0 + pts.height,
            width: pts.width,
            height: pts.height
        }).then(data => {
            console.log(data)
            this.refresh()
        })
    }

    // change the current camera for which you want to update the config area 
    setCurrentCamera = (data) => {

        console.log(data)
        console.log(data.areaConfiguration)
        let savedConfiguration = data.areaConfiguration 

        let config = {
            x0: savedConfiguration.x0,
            y0: savedConfiguration.y0,
            width: savedConfiguration.width,
            height: savedConfiguration.height
        }

        // change state to currently selected camera 
        this.setState({
            currentSource: data.source,
            currentCameraID: data._id,
            currentPointsObject: config
        })

        console.log(config)
    }

    render(){

        console.log(this.state.currentPointsObject)
        
        let buttons = this.state.camerasList ? this.state.camerasList.map((data, index) => {
            console.log(data)
            return data.isActive ?  // only render active cameras 
            <Button style={classes.buttonStyling} key={index} onClick={() => this.setCurrentCamera(data)}>
            {data.name}
            </Button> : null
        }) : null 

        return(
            <div>
                <h1>Configure License Plate Detection Zone</h1>
                <p>Select a camera feed to configuzre its license plate detection area. Only license plates within the desingated box will be detected.</p>
                <div style={classes.buttonsArea}>
                {buttons}
                </div>
                <div style={classes.canvasArea}>
                    <div style={{backgroundColor: 'red', overflow: 'hidden'}}>
                        <canvas style={classes.canvas} ref={this.canvasRef}></canvas>
                        <iframe src={this.state.currentSource} style={{position: 'absolute'}}>

                        </iframe>
                        <ReactPlayer 
                            style={{position: 'absolute'}} 
                            ref={this.videoRef} 
                            url={this.state.currentSource} 
                            playing 
                            muted/>
                    </div>
                    
                    <div style={classes.configButtons}>
                    <Button onClick={
                        () => { 

                            const x0 = this.state.currentPointsObject.x0 
                            const y0 = this.state.currentPointsObject.y0 - 3
                            const width = this.state.currentPointsObject.width
                            const height = this.state.currentPointsObject.height 

                            const coordsObj = {
                                x0: x0, 
                                y0: y0,
                                width: width,
                                height: height
                            }

                            this.setState({currentPointsObject: coordsObj})
                        }
                    }
                    style={{textAlign: 'left', marginBottom: '10px'}}
                    >Vertical Up
                    </Button>
                    <Button onClick={
                        () => { 

                            const x0 = this.state.currentPointsObject.x0  
                            const y0 = this.state.currentPointsObject.y0 + 3
                            const width = this.state.currentPointsObject.width
                            const height = this.state.currentPointsObject.height 

                            const coordsObj = {
                                x0: x0, 
                                y0: y0,
                                width: width,
                                height: height
                            }

                            this.setState({currentPointsObject: coordsObj})
                        }
                    }
                    style={{textAlign: 'left', marginBottom: '10px'}}
                    >Vertical Down
                    </Button>
                    <Button onClick={
                        () => { 
                            
                            const x0 = this.state.currentPointsObject.x0 - 3
                            const y0 = this.state.currentPointsObject.y0 
                            const width = this.state.currentPointsObject.width
                            const height = this.state.currentPointsObject.height 

                            const coordsObj = {
                                x0: x0, 
                                y0: y0,
                                width: width,
                                height: height
                            }

                            this.setState({currentPointsObject: coordsObj})
                        }
                    }
                    style={{textAlign: 'left', marginBottom: '10px'}}
                    >Horizontal Left 
                    </Button>
                    <Button onClick={
                        () => { 
                            
                            const x0 = this.state.currentPointsObject.x0 + 3
                            const y0 = this.state.currentPointsObject.y0 
                            const width = this.state.currentPointsObject.width
                            const height = this.state.currentPointsObject.height 

                            const coordsObj = {
                                x0: x0, 
                                y0: y0,
                                width: width,
                                height: height
                            }

                            this.setState({currentPointsObject: coordsObj})
                        }
                    }
                    style={{textAlign: 'left', marginBottom: '10px'}}
                    >Horizontal Right
                    </Button>
                    <Button onClick={
                        () => { 
                            
                            const x0 = this.state.currentPointsObject.x0  
                            const y0 = this.state.currentPointsObject.y0 
                            const width = this.state.currentPointsObject.width + 3
                            const height = this.state.currentPointsObject.height 

                            const coordsObj = {
                                x0: x0, 
                                y0: y0,
                                width: width,
                                height: height
                            }

                            this.setState({currentPointsObject: coordsObj})
                        }
                    }
                    style={{textAlign: 'left', marginBottom: '10px'}}
                    >Expand Width
                    </Button>
                    <Button onClick={
                        () => { 
                            
                            const x0 = this.state.currentPointsObject.x0  
                            const y0 = this.state.currentPointsObject.y0 
                            const width = this.state.currentPointsObject.width - 3
                            const height = this.state.currentPointsObject.height 

                            const coordsObj = {
                                x0: x0, 
                                y0: y0,
                                width: width,
                                height: height
                            }

                            this.setState({currentPointsObject: coordsObj})
                        }
                    }
                    style={{textAlign: 'left', marginBottom: '10px'}}
                    >Minimize Width
                    </Button>
                    <Button onClick={
                        () => { 
                            
                            const x0 = this.state.currentPointsObject.x0  
                            const y0 = this.state.currentPointsObject.y0 
                            const width = this.state.currentPointsObject.width 
                            const height = this.state.currentPointsObject.height + 3

                            const coordsObj = {
                                x0: x0, 
                                y0: y0,
                                width: width,
                                height: height
                            }

                            this.setState({currentPointsObject: coordsObj})
                        }
                    }
                    style={{textAlign: 'left', marginBottom: '10px'}}
                    >Expand Height
                    </Button>
                    <Button onClick={
                        () => { 
                            
                            const x0 = this.state.currentPointsObject.x0  
                            const y0 = this.state.currentPointsObject.y0 
                            const width = this.state.currentPointsObject.width 
                            const height = this.state.currentPointsObject.height - 3

                            const coordsObj = {
                                x0: x0, 
                                y0: y0,
                                width: width,
                                height: height
                            }

                            this.setState({currentPointsObject: coordsObj})
                        }
                    }
                    style={{textAlign: 'left', marginBottom: '10px'}}
                    >Minimize Height
                    </Button>
                </div>
                </div>
                <a href="/dashboard/configuration" style={{textDecoration: 'none', color: '#000', }}>
                        <span class="material-icons" style={classes.returnArrow}>
                            arrow_back
                        </span>  
                </a>
                <div style={{display: 'flex', marginLeft: '8%', alignItems: 'center', marginTop: '3%'}}>
                    <Button onClick={() => {this.setState({promptSave: true})}}>
                        Save Configuration 
                    </Button> 
                    {/* <Button>
                        Revert Changes
                    </Button> */}
                    <SaveModal open={this.state.promptSave} cancel={() => {this.setState({promptSave: false})}} save={this.submitConfiguration}/>
                </div>          
            </div>
        )
    }
}

export default LprConfig