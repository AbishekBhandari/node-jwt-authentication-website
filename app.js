const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser }= require('./middleware/authMiddleware');

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://abeea984:abishek@cluster0.xmbozom.mongodb.net/node-auth';

mongoose.connect(dbURI).then(() => {
    console.log('App connected to database');
    app.listen(3000, () => {
        console.log(`App is listening to port: 3000`);
    })
})
.catch((error) => {
    console.log(error);
})
// routes
app.get('*', checkUser);
app.get('/', requireAuth, (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

app.get('/set-cookies', (req,res) => {
    // res.setHeader('Set-Cookie','newUser=true');
    res.cookie('newUser', false);
    res.cookie('isEmployee', true, { maxAge: 1000*60*60*24});
    res.send('you got the cookies!');
})

app.get('/read-cookies', (req,res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
});