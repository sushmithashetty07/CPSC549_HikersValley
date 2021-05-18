const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const { translateAliases } = require('./models/trails');
const { concatSeries } = require('async');
const { title } = require('process');
const ejs = require('ejs');
const Review = require('./models/review');
const Trail = require('./models/trails');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoic3VzaG1pdGhhc2hldHR5IiwiYSI6ImNrb2F0cGdqZjAyajQybnM5eWdsdXdncGoifQ.wewvhpjQIs-FIc7N-iVGng'});


const userRoutes = require('./routes/users');
const hikeTrails = require('./routes/hikeTrails');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/trailguide', {

  useNewUrlParser : true,
  useCreateIndex : true,
  useUnifiedTopology : true,
  useFindAndModify : false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("db connected");
});

const app = express();

app.engine('ejs' , ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

 app.use(express.urlencoded({extended: true}));
 app.use(methodOverride('_method'));
 app.use(express.static(path.join(__dirname, 'public')));
 const sessionConfig = {
    secret: 'thisishowwework',
    resave: false,
    saveUninitialized: true,
    cookie: {
       httpOnly: true,
       expires: Date.now()+1000 * 60 * 60 * 24 * 7,
       maxAge: 1000 * 60 * 60 * 24 * 7
    }
 }
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next) => {
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   next();
})

app.use('/', userRoutes);
app.use('/hikeTrails', hikeTrails);
app.use('/hikeTrails/:id/reviews', reviews);
app.get('/',async(req,res) => {
   const hikeTrails =  await Trail.find({});
   res.render('home', { hikeTrails });
});

app.listen(3000, () =>{
 console.log('Serving on port 3000');
})


