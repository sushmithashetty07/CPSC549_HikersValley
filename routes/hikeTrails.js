const express = require('express');
const { isLoggedIn, isAuthor } = require('../middleware');
const { builtinModules } = require('module');
const router = express.Router();
const Trail = require('../models/trails');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoic3VzaG1pdGhhc2hldHR5IiwiYSI6ImNrb2F0cGdqZjAyajQybnM5eWdsdXdncGoifQ.wewvhpjQIs-FIc7N-iVGng'});
// router.get('/', async (req,res) => {
//     const hikeTrails = await Trail.find({});
//     res.render('hikeTrails/index', { hikeTrails })
//  });

 router.get('/', async (req,res) => {
     var hikeTrails = null;
     console.log(req.query);
    if(req.query.title != undefined && req.query.title.trim() != ''){
        const regex = new RegExp(req.query.title.trim(), 'i')
        hikeTrails = await Trail.find({title: {$regex: regex}});

       if(hikeTrails.length == 0 ){
        hikeTrails = await Trail.find({location: {$regex: regex}});
       }
    }
   else{
        hikeTrails = await Trail.find({});
   }
    console.log(hikeTrails);
    res.render('hikeTrails/index', { hikeTrails })
 });
 
 router.get('/new', isLoggedIn, (req,res) => {
     res.render('hikeTrails/new');
  });
 
  router.post('/', isLoggedIn, async(req,res) => {
     const geoData = await geoCoder.forwardGeocode({
        query: req.body.trails.location,
        limit: 1
     }).send();
     const trail = new Trail(req.body.trails);
     trail.geometry = geoData.body.features[0].geometry ;
     trail.author = req.user._id;
     await trail.save();
     req.flash('success','trail added successfully')
     res.redirect(`/hikeTrails/${trail._id}`);
  });
 
  router.get('/:id', async (req,res) => {
    const trail = await Trail.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    res.render('hikeTrails/show', {trail});
 });
 
 router.get('/:id/edit', isLoggedIn, isAuthor, async (req,res) => {
     const{ id } = req.params;
    const trail = await Trail.findById(id);
    res.render('hikeTrails/edit', {trail});
 });

 
 router.put('/:id/', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    const trail = await Trail.findByIdAndUpdate(id,{...req.body.trails},{new:true});
    req.flash('success','trail updated successfully');
    res.redirect(`/hikeTrails/${trail._id}`);
 });
 
 router.delete('/:id/', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    res.redirect('/hikeTrails');
 })

 module.exports = router;