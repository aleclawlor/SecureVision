import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Axios from 'axios'

// render copyright message 
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

// define styling for registry page 
const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    color: '#333',
    backgroundColor: '#333',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// signup page for new school signup 
class SignUp extends Component {

  state = {
      schoolName: '',
      city: '',
      state: '',
      schoolEmail: '',
      password: '',
      confirmPassword: ''
  }

  // handle text field information changes
  schoolNameChangeHandler = (event) => {
      let newState = {...this.state}
      let schoolName = event.target.value 
      newState.schoolName = schoolName 
      this.setState(newState)
  }

  cityChangeHandler = (event) => {
      let newState = {...this.state}
      let city = event.target.value 
      newState.city = city 
      this.setState(newState)
  }

  stateChangeHandler = (event) => {
      let newState = {...this.state}
      let state = event.target.value 
      newState.state = state 
      this.setState(newState)
  }

  emailChangeHandler = (event) => {
      let newState = {...this.state}
      let email = event.target.value 
      newState.schoolEmail = email 
      this.setState(newState)
    }

  passwordChangeHandler = (event) => {
      let newState = {...this.state}
      let password = event.target.value 
      newState.password = password 
      this.setState(newState)
    }

  confirmPasswordChangeHandler = (event) => {
      let newState = {...this.state}
      let confirmPassword = event.target.value 
      newState.confirmPassword = confirmPassword 
      this.setState(newState)
  }

  // submit new school registry to database 
  submitHandler = async () => {
    
    console.log(this.state)

    let submit = await Axios.post('/api/registration/register',{
      schoolName: this.state.schoolName,
      city: this.state.city,
      state: this.state.state,
      email: this.state.schoolEmail.toLowerCase(),
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    })
    
    console.log(submit.data.message, 'data white boii')

    this.setState({
      canSubmit:submit.data.message
    })
  }

  render(){

    const classes = this.props;

    return (
      <Container component="main" maxWidth="xs" style={{marginTop: '5%'}}>
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5" style={{paddingBottom: '25px'}}>
            Register your school
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  onChange = {this.schoolNameChangeHandler}
                  variant="outlined"
                  required
                  fullWidth
                  id="schoolName"
                  label="School Name"
                  name="schoolName"
                  autoComplete="schoolName"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                onChange = {this.cityChangeHandler}
                  autoComplete="city"
                  name="city"
                  variant="outlined"
                  required
                  fullWidth
                  id="city"
                  label="City"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange = {this.stateChangeHandler}
                  variant="outlined"
                  required
                  fullWidth
                  id="state"
                  label="State"
                  name="state"
                  autoComplete="state"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange = {this.emailChangeHandler}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange = {this.passwordChangeHandler}
                  variant="outlined"
                  required
                  fullWidth
                  name="password1"
                  label="Password"
                  type="password"
                  id="password1"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                onChange = {this.confirmPasswordChangeHandler}
                  variant="outlined"
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.submitHandler}
              style={{marginTop: '10%', marginBottom: '5%', backgroundColor: '#F6F7F8', color: '#333'}}
            >
              Register School
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  School already registered? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
        {this.state.redirect}
      </Container>
    )}
}

export default withStyles(useStyles)(SignUp)