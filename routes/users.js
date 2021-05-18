const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) =>{
    res.render('users/register');
});

router.post('/register', async (req, res) =>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success','Welcome to Hike Trails!!');
        res.redirect('/hikeTrails');
    })
    } catch(e){ 
                req.flash('success', e.message);
                res.redirect('register');
     }
});

router.get('/login', (req, res) =>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{ failureFlash: true,failureRedirect: '/login'}), async (req, res) =>{
    req.flash('success', 'Welcome back!!');
    const redirectUrl = req.session.returnTo || '/hikeTrails';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success', 'logged out successfully');
    res.redirect('/hikeTrails');
})
module.exports = router