import React, { Component } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import UnrecognizedTable from './unrecognizedTable'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import io from 'socket.io-client'

const Axios = require('axios')

const accentColor = '#1C63CD'
const accentColor_secondary = '#FD663A'

// material styling 
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  chart: {
      width: '125%',
      height: '300px'
  },
  heatmap: {
      padding: theme.spacing(2),
      width: '75%',
      marginLeft: '25%',
      height: '310px'
  },
  timePlot: {
    marginTop: '30px',
    padding: theme.spacing(2),
    width: '75%',
    marginLeft: '25%',
    height: '310px'
  }
}));

// main unrecognized table component page 
class MyGrid extends Component {

  // initialize a socket for webhooks
  // used to update what is rendered after a new license plate is found 
  // TODO: update with url of server on heroku 
  socket = io.connect('http://localhost:8000')

  // // set interval for refreshing data 
  // intervalId

  state = {
    dataList: [],
    sortType: 'recent',
    loading: true
  }
  
  // set the current sort type 
  // TODO: implement sorting 
  setSort = (type) => {
    
    console.log(type)

    if(type === 'recent'){
      this.setState({sortType: 'recent'})
    }

    else if(type === 'recognitions'){
      this.setState({sortType: 'recognitions'})
    }

    this.refresh()
  }

  // refresh the rendered data to update new unrecognized plates that have entered the school 
  refresh = async() => {

    let data = await Axios.get('/api/lpr/getUnrecognizedData')
    
    let rawData = data.data

    let sorted

    if(this.state.sortType === 'recent'){
      sorted = rawData.sort((a,b) => (a.date < b.date) ? 1: (a.date === b.date) ? ((a.time < b.time) ? 1 : -1): -1)
    }
    
    else if(this.state.sortType === 'recognitions'){
      sorted = rawData.sort((a, b) => (a.entryNumber > b.entryNumber) ? -1 : (a.entryNumber === b.entryNumber) ? -1 : 1)
    }

    localStorage.setItem('lastUnrecognized', JSON.stringify(rawData[0]))
    this.setState({dataList: sorted, loading: false})
  }

  componentDidMount(){

    this.socket.on('licensePlateRecognized', (data) => {
      console.log(data)
      console.log('socket triggered on frontend')
      this.refresh()
    })

    this.refresh()
    // set data fresh interval 
    // this.intervalId = setInterval(this.refresh, 10000)
  }

  componentWillUnmount(){
    clearInterval(this.intervalId)
  }
  
  render(){
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.chart} style={{width: '200%'}}>
                {this.state.loading ? 
                <div style={{marginLeft: '30%'}}>
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
                  // <button onClick={() => {
                  //   // Axios.get('/api/lpr/clearUnrecognizedFeed')
                  //   this.refresh()
                  // }}>Delete All Data</button>,
                  <UnrecognizedTable setSort={this.setSort} dataList={this.state.dataList}/>
                  ]}
            </Paper>
          </Grid>
          <Grid item xs={6}>
          </Grid>
        </Grid>
      </div>
    )};
}

export default withStyles(useStyles)(MyGrid)