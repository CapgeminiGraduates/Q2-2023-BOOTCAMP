const express = require('express'); 
const mongoose = require('mongoose'); 
const path = require('path');

mongoose.connect('mongodb://localhost:27017/capgeniusBase').then(()=>{
    console.log('MONGO CONNECTION OPEN');
}).catch((err)=>{
    console.log('MONGO CONNECTION ERROR');
    console.log(err); 
});

const app = express(); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/home', (req, res)=>{
    res.render('home');
});

app.get('/profile', (req, res)=>{
    res.render('profile');
});

app.get('/login', (req, res)=>{
    res.render('login');
});




app.listen(80, ()=>{
    console.log('APP IS LISTENING ON PORT 80');
});