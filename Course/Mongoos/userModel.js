const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'Please enter your name...!']
     },
     email: {
          type: String,
          required: [true, 'Please enter your email...!'],
          unique: true,
          lowercase: true,
          validate: [validator.isEmail, 'Please enter a valid email...!']
     },
     photo: String,
     password: {
          type: String,
          required: [true, 'Please enter a password...!'],
          minlength: 8,
          select: false
     },
     confirmpassword: {
          type: String,
          required: [true, 'Please enter a confirmpassword...!'],
          validate: {
               validator: function (value) {
                    return value == this.password;
               },
               message: "Password does not match!"
          }
     },

})

userSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();
     // encrypt  the password  before saving it to database
     this.password = await bcrypt.hash(this.password, 12);
     this.confirmpassword = undefined;
     next();
});


userSchema.methods.comparePassswordInDb = async function(password, passwordDb){
     return bcrypt.compare(password, passwordDb);
}





const User = mongoose.model("User", userSchema);
module.exports = User;
