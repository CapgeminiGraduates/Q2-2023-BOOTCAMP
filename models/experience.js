const mongoose = require('mongoose'); 

const experienceSchema = new mongoose.Schema({
    jobTitle: {
        type: String, 
        required: true,
    }, 
    companyName: {
        type: String, 
        required: true, 
    }, 
    startDate: {
        type: String, 
        required: true, 
    }, 
    endDate: {
        type: String, 
        required: true,
    }, 
    description: {
        type: String, 
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },

});

module.exports = mongoose.model('Experience', experienceSchema); 
