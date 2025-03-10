'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const { ObjectID } = require('mongodb');

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.set('views', './views/pug');


app.route('/').get((req, res) => {
  res.render('index', { title: 'Hello', message: 'Please log in' });
});

myDB(async client => {
  const myDataBase = await client.db('database').collection('users');
  app.route('/').get((req,res) => {
    res.render('index', {
      title: 'Connected to database',
      message: 'Please log in',
      showLogin: true
    });
    console.log('MONGO_URI:', process.env.MONGO_URI);
    
    passport.serializeUser((user, done) => {
      done(null, user._id)
    });

    passport.deserializeUser((id, done) => {
      myDataBase.findOne({ _id: new ObjectID(id)}, (err, doc) => {
        done(null, doc)
      })
    });
  })
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', {title: e, message: 'error connectng to database'})
  })
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
