import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles, ThemeProvider } from '@material-ui/core/styles';
import NavigationItem from '../navigationItem/navigationItem'
import Snack from '../snackbar/snackbar'
import { withRouter } from 'react-router-dom'

const Axios = require('axios').default

const logo = require('../../assets/images/sv_updated.svg')

// function to generate copyright statement 
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Secure Vision
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'

// Mateiral UI styling 
const useStyles = (theme => ({
  root: {
    height: '100vh'
  },
  image: {
    // backgroundImage: 'url(https://images.pexels.com/photos/159823/kids-girl-pencil-drawing-159823.jpeg?cs=srgb&dl=girls-on-desk-looking-at-notebook-159823.jpg&fm=jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: accentColor,
    width: '60%'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#F6F7F8',
  },
  form: {
    width: '40%', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  title:{
      fontSize: '70px',
      marginTop: '-20%',
      color: accentColor
  },
  header:{
      lineHeight: '25px',
      alignItems: 'center',
      textAlign: 'center',
      color: accentColor
  },
  link: {
    color: accentColor,
    fontWeight: 850
  }
}));

// login page component 
class SignInSide extends Component {


state = {
  canSubmit: false,
  email: '',
  password: '',
  loginError: false 
}

// try to login with current entered information 
submitHandler = async () => {

    this.setState({snackBar: null})
    console.log('submit activated')
    
    // if the user didn't enter an email, trigger an error   
    if (!this.state.email){
      this.setState({loginError: true, snackBar: <Snack isLogin={true} activate={true} message="Email field must not be blank"/>})
      return 
    }

    // if the user didn't enter a password, trigger an error 
    if(!this.state.password){
      this.setState({loginError: true, snackBar: <Snack isLogin={true} activate={true} message="Password field must not be blank"/>})
      return 
    }

    // check authentication for the current user
    let submit = await Axios.post('/api/auth/authcheck',{
      email: this.state.email.toLowerCase(),
      password: this.state.password
  })

    console.log(submit)
    console.log(submit.data.message)

    // authentication successful; redirect user to dashboard 
    if(submit.data.message === 'success'){
      this.props.setUser(submit)
      this.props.history.push('/dashboard')
    }

    // authentication unsuccessful; tell user login info could not be found 
    else{
      this.setState({loginError: true, snackBar: <Snack isLogin={true} activate={true} message="Login credentials not found in database"/>})
    }
}

// change input field values within component state 
emailChangeHandler = (event) => {
  let newState = {...this.state}
  let email = event.target.value 
  newState.email = email 
  this.setState(newState)
}

passwordChangeHandler = (event) => {
  let newState = {...this.state}
  let password = event.target.value 
  newState.password = password 
  this.setState(newState)
}

render(){

  const {classes} = this.props;
  let snack = this.state.snackBar 

  return (
    // <Grid container component="main" className={classes.root} fullWidth>
      <ThemeProvider>
      <CssBaseline/>
      <Grid item xs={0} sm={18} md={20} component={Paper} elevation={6} square fullwidth>
        <div className={classes.paper}>
            <div className={classes.header}>
            </div>
          <form className={classes.form} noValidate>
          <img src={logo} style={{marginBottom: '40px'}}/>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={this.emailChangeHandler}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.passwordChangeHandler}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <NavigationItem link={this.state.canSubmit ? '/dashboard' : '/'}>
              <Button
              type="submit"
              fullWidth
              style={{
                backgroundColor: accentColor,
                color: '#F6F7F8',
                fontWeight: 550
              }}
              variant="contained"
              color={accentColor}
              className={classes.submit}
              onClick = {() => this.submitHandler()}>
              Sign In
              </Button>
            </NavigationItem>
            <Grid container>
                <Grid item xs>
                  <NavigationItem link='/resetPassword' style={classes.link} color='#6C63FF'>
                    <strong>Forgot Password?</strong>
                  </NavigationItem>
                </Grid>
              <Grid item>
                <NavigationItem link='/register' style={classes.link} color='#6C63FF'>
                    <strong>Register Your School</strong>
                </NavigationItem>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
      {snack}
      </ThemeProvider>
      /* <Grid item xs={true} sm={4} md={7} className={classes.image} />
      {snack} */
    // </Grid>
  )};
}

export default withRouter(withStyles(useStyles)(SignInSide))