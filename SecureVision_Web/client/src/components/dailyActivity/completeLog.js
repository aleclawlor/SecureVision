import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// initialize columns to show in complete feed table as well as their styling 
const columns = [
  { id: 'number', label: 'Plate Number', minWidth: 100 },
  { id: 'recognized', label: 'Recognized Status', minWidth: 150, align: 'left'},
  { id: 'location', label: 'Location', minWidth: 170, align: 'left', format: (value) => value.toFixed(2),},
  { id: 'time', label: 'Time Entered', minWidth: 170, align: 'left', format: (value) => value.toLocaleString(),},
  { id: 'date', label: 'Date', minWidth: 170, align: 'left', format: (value) => value.toLocaleString(),},
];

// create a data row
// currently not used but may be used in the future 
function createData(number, recognized, location, time, date) {
  return { number, recognized, location, time, date};
}

const rows = [];

const useStyles = makeStyles({
  root: {
    backgroundColor: '#FAFAFA',
    color: '#E5E5E5',
    width: '100%',
    height: '200%'
  },
  container: {
    backgroundColor: '#FAFAFA',
    maxHeight: 600,
  },
});

export default function StickyHeadTable(props) {

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // change page for pagination 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const schoolID = JSON.parse(localStorage.getItem('userObj'))._id

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead style={{backgroundColor: '#FAFAFA', fontWeight: 'bold'}}>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: '#FAFAFA'}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (<TableRow hover role="checkbox" tabIndex={-1} key={row.code}></TableRow>);
            })}
            {props.dataList.map((d, i) => {
                    if(d.schoolID === schoolID){  // filter by school-specific ID 
                      let typeIcon;
                      if (d.type === 'Parent'){
                        typeIcon = <i style={{marginLeft: '24%', color: '#1C63CD', opacity: '1'}} class="far fa-id-badge fa-2x"></i>
                      } else {
                        typeIcon = <i style={{marginLeft: '23%', color: '#FD663A', marginTop: '10px'}} class="material-icons">error_outline</i>
                      }

                      // render a table row for each plate in the feed 
                      return(
                        <TableRow key={i}>
                          <TableCell component="th" scope="row">{d.plateNumber}</TableCell>
                          <TableCell align="left">{typeIcon}</TableCell>
                          <TableCell align="left">{d.location}</TableCell>
                          <TableCell align="left">{d.time}</TableCell>
                          <TableCell align="left">{d.date}</TableCell>
                        </TableRow>
                      )}})}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
