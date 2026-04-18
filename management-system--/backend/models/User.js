const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//design user schema
const userSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         required: true, 
         unique: true,
      },
      password: {
         type: String,
         required: true, 
      },
      role: {
         type: String,
         required: true, 
         enum: ['admin', 'user'],
         default: 'user',
      },
   },
   {
      timestamps: true,
   }   
);

//hash password before saving to database
try {
   userSchema.pre('save', async function (next) {
      if (!this.isModified('password')) {
         return next();
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
   })
}
catch(error) {
   next(error);
}

//comapare password
userSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema)

module.exports = User;