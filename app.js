const express = require("express"); 
const mongoose = require("mongoose"); 
const path = require("path");

const mongoDBStore = require("connect-mongo");
const app = express(); 
const User = require("./models/user");
const Experience = require("./models/experience"); 

app.use(express.urlencoded({extended:true}));

const dbUrl = 'mongodb://localhost:27017/capgeniusBase'; 

mongoose.connect(dbUrl).then(()=>{
    console.log('MONGO CONNECTION OPEN');
}).catch((err)=>{
    console.log('MONGO CONNECTION ERROR');
    console.log(err); 
});

const store = mongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, 
    crypto:{
        secret: 'thisshouldbeasecret'
    }
});

store.on('error', function(e){
    console.log('SESSION STORE ERROR', e);
});

const session = require('express-session'); 

const sessionConfig = {
    store: store, 
    name: 'session',
    secret: 'thisshouldbeasecret', 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    },
};

app.use(session(sessionConfig));

//Authentication requirements
const passport = require("passport"); 
const LocalStrategy = require("passport-local"); 

app.use(passport.initialize()); 
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); //Adds authenticate() method to our user model. 

// Methods to add or remove a user from a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/signup', (req, res)=>{
    res.render('testSignup');
});

app.get('/profile', (req, res)=>{
    res.render('profile');
});

const authenticateUser = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'})

app.get('/login', async (req, res)=>{
    res.render('testlogin');
});

app.post('/login', authenticateUser, async (req, res, next)=>{
    // res.send('SUCCESSFUL LOGIN')
    // req.logOut(function(err){
    //     if(err){
    //         return next(err); 
    //     }
    // })

    res.redirect('/home'); 
})

app.post('/signup', async(req, res)=>{
    const {username, email, firstname, surname, password} = req.body;
    const user = await new User({username, email, firstname, surname}); 
    const registeredUser = await User.register(user, password);
    res.render('profiletest', {registeredUser}); 
});

app.get('/home', async(req, res)=>{
    const allUsers = await User.find({}); 
    res.render('home', {allUsers});
});

// app.get('/profiletest', (req, res)=>{
    
// })

app.listen(80, ()=>{
    console.log('APP IS LISTENING ON PORT 80');
});