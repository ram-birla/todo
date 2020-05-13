const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');


const user_Schema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
});


// user_Schema.methods.setPassword = function setPassword(password1,password2) {
//     this.passwordHash = bcrypt.hashSync(password1, 10)
//     this.passwordHash = bcrypt.hashSync(password2, 10)
// }

// user_Schema.methods.generateJWT = function generateJWT() {
//     return jwt.sign({
//         email: this.email,
//     }, 'secret')
// }

// user_Schema.methods.toAuthJSON = function toAuthJSON() {
//     return {
//         email: this.email,
//         token: this.generateJWT()
//     }
// }

module.exports = mongoose.model("User", user_Schema)


// user_Schema.pre('save', function (next) {
//     var user = this;
//     bcrypt.hash(user.password, 10, function (err, hash){
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       next();
//     })
//   });