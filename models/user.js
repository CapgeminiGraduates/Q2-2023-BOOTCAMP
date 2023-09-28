const mongoose = require('mongoose'); 
const passportLocalMongoose = require('passport-local-mongoose');

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
    experience: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Experience',
    }, 
}); 

//Adds username, and hashed password field to schema and document automatically
//Ensures username is unique
//Provides additional methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);