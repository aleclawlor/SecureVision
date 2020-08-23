const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = (process.env.NODE_ENV === 'production') ?  null : require('./config/keys')
const http = require('http')
const passport = require('passport')
// const cookieSession = require('cookie-session');    
const cors = require('cors');
const path = require('path');
const socket = require('socket.io')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
// const enforce = require('express-sslify');

require('./services/passportLogic')
// init routes and models
const routes = require('./routes/index')

mongoose.connect(process.env.mongoURI || keys.mongoURI,  {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    mongoose.connection.on('connected', function () {  
        console.log('Mongoose default connection open to DB');
      }); 

const app = express();
// // body parser
app.use(express.urlencoded({ extended: true }))
.use(express.json())
.use(bodyParser.urlencoded({ extended: false })) 
.use(cors())
.use(passport.initialize())
.use(passport.session())
.use(express.static('public'))
.use('/api', routes)

// use sessions for tracking logins
// app.use(session({
//     secret: 'secret',
//     originalMaxAge: 30*24*60*60*1000,
//     secure: false,
//     store: new MongoStore({ mongooseConnection: mongoose.connection })
// }))

// app.use(cookieSession({
//     name: 'session',
//     keys: []
// }))

if(process.env.NODE_ENV === 'production'){

    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

// port to listen to 
const PORT = process.env.PORT || 8000
const server = app.listen(PORT, function(){
    console.log('Listening on port: ',PORT)
    console.log('Auto reload successful')
    console.log(keys)
});

const io = require('socket.io')(server)
io.on('connection', socket => {
    console.log(socket + ' connected to backend')
    // this is where we do the server side handling of sockets (emitting, broadcasting)

    socket.on('licensePlateRecognized', (data) => {
        console.log(data)
        io.sockets.emit('licensePlateRecognized', data)
    })

    socket.on('cameraAdded', (data) => {
        console.log(data)
        io.sockets.emit('cameraAdded', data)
    })

})



