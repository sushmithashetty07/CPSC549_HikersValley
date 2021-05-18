
const mongoose = require('mongoose');
const Trail = require('../models/trails');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
// const { concatSeries } = require('async');
// const { title } = require('process');


mongoose.connect('mongodb://localhost:27017/trailguide', {

  useNewUrlParser : true,
  useCreateIndex : true,
  useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("db connected");
});



const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Trail.deleteMany({});
   for(let i = 0; i < 50; i++){
       const random1000 = Math.floor(Math.random() * 1000);
     const hike =   new Trail({
           author: '608a35df9711cca07df56a9e',
           location : `${cities[random1000].city}, ${cities[random1000].state}`,
           title : `${sample(descriptors)} ${sample(places)}`,
           image : 'https://source.unsplash.com/collection/170843',
           difficultyLevel : 'easy'
       })
       await hike.save();
   }
   
}

seedDB(). then(() =>{
    mongoose.connection.close();
});
