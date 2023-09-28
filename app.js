const express = require("express"); 
const mongoose = require("mongoose"); 
const path = require("path");

const mongoDBStore = require("connect-mongo");
const app = express(); 
const User = require("./models/user");
const Experience = require("./models/experience"); 

const ejsMate = require('ejs-mate');

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

const flash = require('connect-flash');
app.use(flash());


//Authentication requirements
const passport = require("passport"); 
const LocalStrategy = require("passport-local"); 

app.use(passport.initialize()); 
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); //Adds authenticate() method to our user model. 

// Methods to add or remove a user from a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const authenticateUser = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'})

const isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in!');
        res.redirect('/login'); 
    }
    next(); 
}

app.use((req, res, next)=>{
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error'); 
    next(); 
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate)

app.get('/signup', (req, res)=>{
    res.render('signup');
});

app.post('/signup', async(req, res)=>{

    try{
        const {username, email, firstname, surname, password} = req.body;
        const user = await new User({username, email, firstname, surname}); 
        const newUser = await User.register(user, password);
        req.login(newUser, function(err){
            if(err){
                return next(err)
            }
            req.flash('success', 'Welcome to your account!')
            res.redirect('/profiles');
        });
    }catch(err){
        req.flash('error', err);
        res.redirect('/signup')
    };
});

app.get('/profiles', isLoggedIn, async (req, res)=>{
    const allUsers = await User.find({});
    res.render('allProfiles', {allUsers});
});

app.get('/profiles/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params; 
    const user = await User.findById(id); 
    res.render('userProfile', {user}); 
});


app.get('/login', async (req, res)=>{
    res.render('login');
});

app.post('/login', authenticateUser, async (req, res) =>{
    req.flash('success', 'Welcome back!'); 
    res.redirect('/profiles');
});

app.get('/logout', async (req, res)=>{
    req.logOut(function(err){
        if(err){
            return next(err);
        }
        req.flash('success', 'Come back soon!');
        res.redirect('/login');
    });
});


app.listen(80, ()=>{
    console.log('APP IS LISTENING ON PORT 80');
});