import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'

// Material UI themes for modal 
const useStyles = makeStyles(theme => ({
  root: {
    height: 300,
    flexGrow: 1,
    minWidth: 300,
    transform: 'translateZ(0)',
    '@media all and (-ms-high-contrast: none)': {
      display: 'none',
    },
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)'
  },
  paper: {
    width: 600,
    height: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '5px',
    backgroundColor: '#F6F7F8',
    color: primaryColor,
    outline: 'none'
  },
}));

// modal component from materialUI
export default function ServerModal(props) {

  const classes = useStyles();
  const rootRef = React.useRef(null);

  return (
    <div ref={rootRef}>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open = {props.shouldOpen}
        aria-labelledby="server-modal-"
        aria-describedby="server-modal-description"
        className={classes.modal}
        container={() => rootRef.current}
      >
        <div className={classes.paper}>
          <h2 id="server-modal-title">{props.title}</h2>
          <p id="server-modal-description">{props.description}</p>
          {props.children}
        </div>
      </Modal>
    </div>
  );
}
