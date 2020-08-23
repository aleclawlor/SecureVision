import React, { Component } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, TextField } from '@material-ui/core';
import TableItem from './tableItem'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

const Axios = require('axios')

// function used to create a cell within the active plates table
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#333',
    color: '#303030',
    fontSize: 17,
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

function createData(name, type, platenumber, actions) {
  return { name, type, platenumber, actions };
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    maxHeight: 400,
    overflow: 'scroll'
  },
});

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'
const accentColor_secondary = '#FD663A'


class CustomizedTables extends Component {

  state = {
      data: [],
      showParentEdit: false,
      showParentDeactivate: false,
      search: '',
      searchType: 'Plate Number',
      loading: true 
  }

  // handle sorting between parent and high risk type 
  handleSortChange = () => {

    if(this.state.searchType === 'Plate Number'){
      this.setState({searchType: 'Parent Name'})
    }

    else if(this.state.searchType === 'Parent Name'){
      this.setState({searchType: 'Plate Number'})
    }
  }

  async componentDidMount(){

    // get all data (parent and high risk) on initial component mount and merge
    let getData =  await Axios.get('/api/get/getPlates')
    let getHighAlert = await Axios.get('/api/get/getHighRisk')

    let plateData = getData.data
    let highAlertData = getHighAlert.data

    // merge parent plate and highAlert plate data
    let mergedData = plateData.concat(highAlertData)
    console.log("Plate list:", mergedData)

    this.setState({data: mergedData, loading: false})
  }

  onCancel = () => {
    this.setState({showParentEdit: false, showParentDeactivate: false})
  }

  // submitted callback to refresh the db and update the table component
  submitted = async() => {
    this.setState({showParentEdit: false, showParentDeactivate: false})

    let getData =  await Axios.get('/api/get/getPlates')
    let getHighAlert = await Axios.get('/api/get/getHighRisk')

    let plateData = getData.data
    let highAlertData = getHighAlert.data

    // merge parent plate and highAlert plate data
    let mergedData = plateData.concat(highAlertData)
    console.log("Plate list:", mergedData)

    this.setState({data: mergedData})
  }

  // update search bar search value 
  updateSearch = (event) => {

    // assume search value won't be larger than 20 characters long 
    this.setState({search: event.target.value.substr(0, 20)})
    console.log("Search")
  }

  render(){
  const {classes} = this.props;

  // filter the data by name pr number
  let filteredData = this.state.data.filter(
    (person) => {

      // filter by name 
      if(this.state.searchType === 'Parent Name'){
        // the name we're searching for is a parent plate
        if(person.parentName){
          return person.parentName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        }
        // the name we're searching for is a criminal plate
        else if(person.name){
          return person.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        }
      }

      // the user chooses to search by plate number 
      else if(this.state.searchType === 'Plate Number'){
        if(person.plateNumber){
          return person.plateNumber.indexOf(this.state.search) !== -1
        }
      }
    }
  )
  
  const headerCellStyle={backgroundColor: '#F6F7F8', color: primaryColor, fontWeight: 'bold', fontSize: '15px'}
  const schoolID = JSON.parse(localStorage.getItem('userObj'))._id

  return (
  <div>
    <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
      <TextField 
        onChange={this.updateSearch} 
        color={accentColor}
        label={<span style={{marginLeft: '10px', marginBottom: '5px', fontSize: '15px'}}>Searching By {this.state.searchType === 'Plate Number' ? 'Number' : 'Name'}</span>} 
        variant="outlined" 
        style={{width: '250px', height: '15px', marginBottom: '50px'}}>
      </TextField>
      <Button style={{height: '75%', marginLeft: '10px', color: accentColor, fontWeight: 550}} onClick={this.handleSortChange}>
        Search by {this.state.searchType === 'Parent Name' ? 'Plate Number' : 'Parent Name'}
      </Button>
    </div>
    {this.state.loading ?
    <div style={{marginLeft: '28%'}}>
      <Loader
      type="Rings"
      color={accentColor}
      secondaryColor={accentColor_secondary}
      height={400}
      width={400}
      />
    </div> : 
    <TableContainer component={Paper} style={{maxHeight: 600}}>
      <Table className={classes.table} stickyHeader aria-label="sticky table">
        <TableHead style={{color: '#fff'}}>
          <TableRow>
            <StyledTableCell style={headerCellStyle}>Name</StyledTableCell>
            <StyledTableCell style={headerCellStyle} align="left">Type</StyledTableCell>
            <StyledTableCell style={headerCellStyle} align="left">Plate Number</StyledTableCell>
            <StyledTableCell style={headerCellStyle} align="right">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{maxHeight: 550, overflow: 'scroll', color: '#000A40'}}>
          {filteredData.map((row, i) => {
            if(row.isActive && row.schoolID === schoolID){
                return <TableItem 
                  i={i} 
                  id={row._id} 
                  onSubmit={this.submitted} 
                  studentName={row.studentName} 
                  name={row.parentName ? row.parentName : row.name} 
                  type={row.parentName ? 'Parent': row.type} 
                  plateNumber={row.plateNumber}/>
              }
          })}
        </TableBody>
      </Table>
    </TableContainer>}
    </div>
  )};
}

export default withStyles(useStyles)(CustomizedTables)