import React, { Component } from 'react'
import VideoComponent from './VideoComponent'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import MainFeed from './mainFeed'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

const Axios = require('axios')

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'
const accentColor_secondary = '#FD663A'

class CameraLayout extends Component {

    state = {
        camerasList: [],
        cameraNames: [],
        loading: true 
    }
    
    componentDidMount(){

        // get all current cameras in the DB and add them to component state
        const getCameras = async() => {
            let result = await Axios.get('/api/cameras/getCameras')
            console.log(result)
            this.setState({camerasList: result.data})
            this.setState({cameraNames: result.data.map((d) => {
              if(d.isActive){
                return d.name
            }
             })})
        }

        // call the function defined above; defined as a function in case I need to use in the future
        // set loading to false for the loader visual
        getCameras()
        this.doneLoading()
    }

    // stop the loading icon from showing 
    doneLoading = () => {
      console.log('setting loading to false')
      this.setState({loading: false})
    }

    render(){
    
    // get school ID stored in local storage
    const schoolID = JSON.parse(localStorage.getItem('userObj'))._id
    let scrollSideStyle = {height:'610px', color: primaryColor, width: '400px', position: 'absolute', marginLeft: '140px', overflow: 'scroll', textAlign: 'center'}

    return(
      this.state.loading ? 
      <div style={{marginLeft: '35%', marginTop: '8%'}}>
        <Loader
        type="Rings"
        color={accentColor}
        secondaryColor={accentColor_secondary}
        height={400}
        width={400}
        />
      </div>
      :
      <div style={{width: '100%', height: '700px', color: primaryColor}}>
          <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper style={{width:'700px', height:'600px' ,marginRight: '400px', backgroundColor: '#F6F7F8'}}>
              <MainFeed name={"Main Entrance"} buttonNames={this.state.cameraNames}/>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <div style={scrollSideStyle}>
              <div style={{gridTemplateRows: 'repeat(6, 325px)', width: '30%', marginLeft: '50px'}}>
                {this.state.camerasList.map((d, i) => {
                  if(d.isActive && d.schoolID === schoolID){
                    return(<VideoComponent key={i} source={d.source} name={d.name} port={d.port}></VideoComponent>)
                  }
                })}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
  )}
}

export default CameraLayout