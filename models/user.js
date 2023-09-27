const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    firstname:{
        type: String, 
        required: true
    }, 
    surname: {
        type: String, 
        required: true,
    },
    skills: {
        type: [String], 
    },
    hobbies: {
        type: [String], 
    },
    email:{
        type: String, 
        required: true, 
        unique: true,
    }, 
}); 

const User = mongoose.Model('User', userSchema);

module.exports = User;