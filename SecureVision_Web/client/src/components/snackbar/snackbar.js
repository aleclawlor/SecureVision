import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const accentColor = '#1C63CD'

// snackbar component 
class Snack extends Component {
  
  state = {
    activate: true  
  }

  handleClose = (event, reason) => {

    this.setState({activate: false})
    return 
  };

render(){
    
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: this.props.isLogin ? 'bottom' : 'top',
          horizontal: 'center',
        }}
        open={this.state.activate}
        autoHideDuration={6000}
        style={{
          fill: '#fff',
          zIndex: 4000
        }}
        onClose={this.handleClose}
        message={this.props.message}
        action={
          <React.Fragment>
            <Button style={{color: accentColor, fontWeight: 550}} color={accentColor} size="large" onClick={this.handleClose}>
              Dismiss
            </Button>
            <IconButton style={{color: accentColor, fontWeight: 550}} size="small" aria-label="close" color={accentColor} onClick={this.handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  )};
}

export default Snack