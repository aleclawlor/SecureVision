const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', userSchema)
module.exports = User

module.exports.getUserByEmail = function(email, callback){
    var query = {email: email};
    User.findOne(query, callback);
  }
  
  module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
  }
  
  module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
    });
  }

  module.exports.createUser = (newSchoolUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newSchoolUser.password, salt, (err, hash) => {
            newSchoolUser.password = hash 
            newSchoolUser.save(callback)
        })
    })
}