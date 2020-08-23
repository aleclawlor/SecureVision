import React, {Component} from 'react'
import TableFixedHeader from './completeLog'
import Snackbar from '../snackbar/snackbar'
import Button from '@material-ui/core/Button'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import io from 'socket.io-client'

import EmergencyContactsModal from '../dashboard/dashboardElements/emergency'

import Axios from 'axios'

const accentColor = '#1C63CD'
const accentColor_secondary = '#FD663A'

// component to show the high risk activity as well as the parent activity 
class activityLayout extends Component{

  // initialize a socket for webhooks
  // used to update what is rendered after a new license plate is found 
  // TODO: update with url of server on heroku 
  socket = io.connect('http://localhost:8000')

  // // used for refreshing the data 
  // intervalId

  state = {
    dataList: [],
    triggerHighRisk: false,
    mostRecentCriminalNumber: '',
    mostRecentCriminalType: '',
    mostRecentCriminalTime: '',
    snackbar: null,
    loading: true   
  }
  
  schoolID = JSON.parse(localStorage.getItem('userObj'))._id
  
  // check to see if there are new plates entering the school 
  refresh = async(src) => {
    
    console.log('instance of refresh')
    // get all feed data (parents and high risk) from the database
    // database is updated in the Python program so Mongo collection may or may not be updated on each cycle
    let data = await Axios.get('/api/lpr/getGeneralData')
    
    // filter the data so the user only sees school specific plates 
    let rawData = data.data
    rawData = rawData.filter((d) => {
      return d.schoolID === this.schoolID
    })
    
    // sort the data by time 
    let sorted = rawData.sort((a,b) => (a.date < b.date) ? 1: (a.date === b.date) ? ((a.time < b.time) ? 1 : -1): -1)
    let currentList = this.state.dataList

    // go through the new additions to the database 
    if(currentList.length != sorted.length && currentList.length != 0){

        const num_new = sorted.length - currentList.length 
        console.log('New Plates: ', num_new)

        let i = 0
        // cycle through each new plate recognized 
        while(i < num_new){

          let newPlate = sorted[i]
          // console.log(newPlate)

          // new plate recognized is a high risk plate
          // if this is the case, trigger the snackbar to show the data for the high risk plate recognized
          if(newPlate.type != 'Parent'){

            // TODO: render image data to frontend 
            // let binaryImageEncoding = newPlate.imageData
            // let recognized_plate_img = new Image()
            // let src = 'data:image/png;base64,' + binaryImageEncoding
            // console.log(src)
            // recognized_plate_img.src = src 

            localStorage.setItem('lastHighRisk', JSON.stringify(newPlate))

            console.log('trigger high risk modal')
            console.log('image data: ', src)
            // src = new Uint8Array(src)
            
            // src = src.reduce((data, byte)=> {
            //   return data + String.fromCharCode(byte);
            //   }, '')

            // src = String.fromCharCode.apply(null, src)
            // const base64 = btoa(src)
            // const url = 'data:image/jpg;base64, ' + base64
            // console.log(url)

            this.setState({
              triggerHighRisk: true,
              snackbar: <Snackbar
                message={[
                    <span key="1" style={{fontSize: '24px', marginBottom: '25px', color: ''}}>High Risk Plate Detected</span>,
                    <br key="2"></br>,<br key="3"></br>,
                    // recognized_plate_img,
                    // <img src={url} style={{height: '400px', width: 'auto'}}></img>,
                    <span key="4" style={{fontSize: '20px', marginBottom: '15px'}}>Plate: {newPlate.plateNumber}</span>,
                    <br key="5"></br>,
                    <span key="6" style={{fontSize: '20px', marginBottom: '15px'}}>Threat Type: {newPlate.type}</span>,
                    <br key="7" ></br>,
                    <span key="8" style={{fontSize: '20px', marginBottom: '15px'}}>Location: {newPlate.time}</span>,
                    <div key="9" style={{fontSize: '20px', marginTop: '35px', width: '100%', textAlign: 'center', display: 'flex', justiftContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                      <Button style={{color: '#fff'}} onClick={this.props.openModal}>Load Emergency Contacts</Button>
                      <Button style={{color: '#fff'}}>Report Misread</Button>
                    </div>
                ]}
                activate={false}>
            </Snackbar>
            })
          }
          i++
        }
        console.log('recognized a plate')
        this.setState({dataList: sorted, triggerHighRisk: false})
    }
    this.setState({dataList: sorted, loading: false})
  }

  componentDidMount(){

    this.socket.on('licensePlateRecognized', (data) => {

      const img_data = data.data
      console.log(img_data)

      console.log('socket triggered on frontend')
      this.refresh(img_data ? img_data : null)
    })

    this.refresh(null)
    // this.intervalId = setInterval(this.refresh, 6000) // set interval to refresh data 
  }

  componentWillUnmount(){
      clearInterval(this.intervalId) // clear refreshing when the component dismounts
  }

  render(){
    
    return(
        <div>
            {this.state.loading ? 
              <div style={{marginLeft: '28%'}}>
                <Loader
                type="Rings"
                color={accentColor}
                secondaryColor={accentColor_secondary}
                height={400}
                width={400}
                />
              </div>
              :
              [
              <TableFixedHeader dataList={this.state.dataList}/>
              ]
            }
            <EmergencyContactsModal/>
            {this.state.snackbar}
        </div>
       )
    }
}

export default activityLayout