'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//user schema 
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type:String
    }
});
   var User = mongoose.model('user', UserSchema);
   
   UserSchema.pre('save', function (next) {
    
      const user = this;
      if (!user.isModified('password')) { return next(); }
    
      bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
    
        bcrypt.hash(user.password, salt, null, (error, hash) => {
          if (error) { return next(error); }
          user.password = hash;
          next();
        });
      });
    });
   module.exports= User;
  
// assignment schema
var AssignmentsSchema = mongoose.Schema({
    username:{
        type:String
    },
    dueDate:{type:String},
    orderId: [{type:Buffer}],
    isNewAssignment:
      {
        type:Boolean,
        default: true
      },
    isInProgress:
      {
        type:Boolean,
        default: false
      },
    isCompleted:
      {
        type:Boolean,
        default:false
      }
});
var Assignment = mongoose.model('assignments', AssignmentsSchema);

module.exports = Assignment;

var SubjectSchema = mongoose.Schema({
    subjects:[{type:String}]
});
var Subject = mongoose.model('subjects',SubjectSchema);
module.exports = Subject;

