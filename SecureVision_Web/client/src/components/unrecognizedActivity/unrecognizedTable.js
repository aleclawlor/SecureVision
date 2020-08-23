import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button'
import Snackbar from '../snackbar/snackbar'

// add columns for number of visits and criminal record
const columns = [
  { id: 'number', label: 'Plate Number', minWidth: 100 },
  { id: 'location', label: 'Location', minWidth: 170, align: 'left', format: (value) => value.toFixed(2),},
  { id: 'recognitions', label: 'Recognitions', minWidth: 130, align: 'left', format: (value) => value.toLocaleString(),},
  { id: 'time', label: 'Time Entered', minWidth: 170, align: 'left', format: (value) => value.toLocaleString(),},
  { id: 'date', label: 'Date', minWidth: 170, align: 'left', format: (value) => value.toLocaleString(),},
];

// function to create a data row; may be used in future 
function createData(number, location, recognitions, time, date) {
  return { number, location, recognitions, time, date};
}

// material styling 
const useStyles = makeStyles({
  root: {
    backgroundColor: '#F6F7F8',
    color: '#F6F7F8',
    width: '100%',
    height: '200%'
  },
  container: {
    backgroundColor: '#FAFAFA',
    maxHeight: 600,
  },
});

// table to hold unrecognized license plate visuals
export default function StickyHeadTable(props) {

  const classes = useStyles();
  // const schoolID = JSON.parse(localStorage.getItem('userObj'))._id

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead style={{backgroundColor: '#FAFAFA'}}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#F6F7F8', fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.dataList.map((d, i) => {
              if(d.schoolID || d.location){  // filter school specific data 
              return (
              <TableRow key={i}>
                  <TableCell component="th" scope="row">{d.plateNumber}</TableCell>
                  <TableCell align="left">{d.location}</TableCell>
                  <TableCell align="left">{d.entryNumber}</TableCell>
                  <TableCell align="left">{d.time}</TableCell>
                  <TableCell align="left">{d.date}</TableCell>
              </TableRow>
            )}
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{width: '100%', marginTop: '25px', marginLeft: '15px', paddingBottom: '30px'}}>
        <strong style={{color: '#000A40'}}>Sort By: </strong>
        <Button style={{color: '#000A40'}} onClick={() => {props.setSort('recent')}}>Most Recent</Button>
        <Button style={{color: '#000A40'}} onClick={() => {props.setSort('recognitions')}}>Most Frequent</Button>
      </div>
    </Paper>
  );
}
