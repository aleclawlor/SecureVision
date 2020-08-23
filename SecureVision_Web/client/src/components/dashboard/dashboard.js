import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import {ThemeProvider} from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems } from './dashboardElements/listItems';
import Emergency from './dashboardElements/emergency'
import SchoolHeader from './dashboardElements/schoolHeader'
import UserRegister from '../registerNewPlate/registerUser'
import PlateFeed from '../activePlatesFeed/searchTable'
import ConfigFeed from '../configuration/configuration'
import CamFeed from '../cameraFeed/cameraLayout'
import DailyFeed from '../dailyActivity/activityLayout'
import UnrecongizedLayout from '../unrecognizedActivity/unrecognizedDashboard'
import Button from '@material-ui/core/Button'
import LprConfig from '../configuration/lprConfig'
import { MdPhoneForwarded } from 'react-icons/md'
import { withRouter } from 'react-router-dom'
import LogoutModal from './dashboardElements/logoutModal'
import RecognitionListener from './dashboardElements/recgonitionListener'
import { shadows } from '@material-ui/system'

import axios from 'axios'
const logo = require('../../assets/images/sv_updated.png')

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        SecureVision
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'
const backgroundColor = '#FAFAFA'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    fontFamily: 'Muli, sans-serif',
    zIndex: '1',
    boxShadow: 'none'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: backgroundColor,
    color: primaryColor,
    border: 'none',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: 'none',
    outline: 'none',
    // borderBottom: '.5px solid rgba(0, 0 ,0, .15)'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: backgroundColor,
    position: 'relative',
    border: 'none',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    border: 'none',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    border: 'none',
    overflow: 'auto',
    backgroundColor: backgroundColor
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: backgroundColor
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    color: accentColor,
    backgroundColor: backgroundColor,
    border: 'none',
    fontWeight: 500
  },
  fixedHeight: {
    height: 240,
    backgroundColor: backgroundColor
  },
}));

let highRiskRecent, unregisteredRecent

export default withRouter(function Dashboard(props) {

  useEffect(() => {
    console.log('in useEffect')
    const myUser = JSON.parse(localStorage.getItem('userObj'))

    localStorage.setItem('lastUnrecognized', JSON.stringify({plateNumber: '', location: '', time: '', date: ''}))
    localStorage.setItem('lastHighRisk', JSON.stringify({plateNumber: '', location: '', time: '', date: ''}))
    
    setUser(myUser)
  }, [])

  const registerLogout = () => {
    let logout = axios.get('/api/auth/logout')
    console.log(logout)
    props.history.push('/')
  }

  const classes = useStyles()
  const [user, setUser] = React.useState(props.user)
  const [open, setOpen] = React.useState(true)
  const [promptLogout, setLogoutOpen] = React.useState(false)
  const [toggleContactsModal, setContactsModal] = React.useState(false)
  const [mostRecentCriminalPlateObject, setMostRecentCriminalPlate] = React.useState(null)
  const [mostRecentUnrecognizedPlateObject, setMostRecentUnrecognizedPlate] = React.useState(null)

  let currPath = window.location.pathname
  let mostRecentString

  const handleLogoutOpen = () => {
    setLogoutOpen(true)
  }

  const handleLogoutCancel = () => {
    setLogoutOpen(false)
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleContactsOpen = () => {
    console.log('modal open')
    setContactsModal(true)
  }

  const handleContactsClose = () => {
    console.log('modal close')
    setContactsModal(false)
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  let feedToShow

  let lastUnrecognized = JSON.parse(localStorage.getItem('lastUnrecognized')) || {plateNumber: '', location: '', time: '', date: ''}
  let lastHighRisk = JSON.parse(localStorage.getItem('lastHighRisk')) || {plateNumber: '', location: '', time: '', date: ''}

  let defaultFeed = (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper elevation={0} className={fixedHeightPaper} style={{height: '100%'}}>
            <SchoolHeader 
              school={user ? user.schoolName : 'BC'}
              location={user ? user.city + ', ' + user.state : 'Chestnut Hill, MA'}/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper elevation={0} className={fixedHeightPaper} style={{textAlign: 'center'}}>
            <Button onClick={()=>{handleContactsOpen()}} style={{width: '100%', height: '100%', fontSize: '120px', marginTop: '-5px', color: accentColor, textAlign: 'center'}}>
            <span style={{fontSize: '100px', color: accentColor}} class="material-icons">
            call
          </span>
            </Button>
            <p style={{fontSize: '20px', marginTop: '5px', color: primaryColor, fontWeight: 750}}>Emergency Contacts</p>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0} className={classes.paper} spacing={3}>
            <div style={{marginLeft: '25px', fontSize: '20px', color: primaryColor}}>
              <h3>Last Unregistered Entry: {lastUnrecognized.plateNumber} - {lastUnrecognized.location} - {lastUnrecognized.time} - {lastUnrecognized.date}</h3>
              <h3>Last Criminal Entry: {lastHighRisk.plateNumber} - {lastHighRisk.location} - {lastHighRisk.time} - {lastHighRisk.date}</h3>
            </div>
          </Paper>
        </Grid>
    </Grid>
    <Box pt={4}>
    <Copyright />
    </Box>
  </Container>)

  let dailyFeed = (
    <Container maxWidth="lg" className={classes.container}>
      <DailyFeed openModal={handleContactsOpen} setMostRecent={setMostRecentCriminalPlate}/>
    </Container>
  )
  
  let unrecognizedFeed = (
    <Container maxWidth="lg" className={classes.container}>
      <UnrecongizedLayout setMostRecent={setMostRecentUnrecognizedPlate} />
    </Container>
  )
  
  let cameraFeed = (
    <Container maxWidth="lg" className={classes.container}>
      <CamFeed />
    </Container>
  )
  
  let newUserFeed = (
    <Container maxWidth="lg" className={classes.container}>
      <UserRegister></UserRegister>
    </Container>
  )
  
  let plateFeed = (
    <Container maxWidth="lg" className={classes.container}>
      <PlateFeed />
    </Container>
  )
  
  let configFeed = (
    <Container maxWidth="lg" className={classes.container}>
      <ConfigFeed />
    </Container>
  )
  
  let lprConfigFeed = (
    <Container maxWidth="lg" className={classes.container}>
      <LprConfig />
    </Container>
  )
  
  switch(currPath){
    case '/dashboard/activity':
      feedToShow = dailyFeed
      break
    case '/dashboard/unrecognized':
      feedToShow =  unrecognizedFeed
      break
    case '/dashboard/cameras':
      feedToShow = cameraFeed
      break 
    case '/dashboard/registerNewUser':
      feedToShow =  newUserFeed
      break 
    case '/dashboard/plates':
      feedToShow = plateFeed
      break
    case '/dashboard/configuration':
      feedToShow = configFeed
      break
    case '/dashboard/configuration/lprConfig':
      feedToShow = lprConfigFeed
      break
    default:
      feedToShow = defaultFeed
      break 
  }

  const theme = createMuiTheme({
    typography: {
      // Tell Material-UI what's the font-size on the html element is.
     fontWeight: 'bold'
    },
  });

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)} elevation={4}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="#000A40"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="#000A40" noWrap className={classes.title}>
            <img src={logo} style={{height: '45px', width: 'auto', marginTop: '10px'}}></img>
          </Typography>
          <Button color={accentColor} onClick={setLogoutOpen} style={{fontWeight: 550}}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}>
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        {/* <Divider /> */}
        <List>{mainListItems}</List>
        {/* <Divider /> */}
        <Button onClick={()=>{handleContactsOpen()}} style={{height: '100%'}}>
          <span style={{fontSize: open ? '85px' : '40px', color: accentColor}} class="material-icons">
            contact_phone
          </span>
        </Button>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
        {feedToShow}
        <Emergency shouldOpen={toggleContactsModal} close={handleContactsClose}/>
        <LogoutModal open={promptLogout} cancelLogout={handleLogoutCancel}/>
        <RecognitionListener/>
      </main>
      </ThemeProvider>
    </div>
  );
})