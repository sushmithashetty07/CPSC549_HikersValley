const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const hikingTrailSchema = new Schema({
  title : String,
  image : String,
  geometry : {
      type : {
        type : String,
        enum : ['Point'],
        required : true
      },
      coordinates : {
        type : [Number],
        required : true
      }
  },
  description : String,
  difficultyLevel : String,
  location : String,
  author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
},opts);

hikingTrailSchema.virtual('properties.popUpMarkup').get(function (){
  return `<div><a href="/hikeTrails/${this._id}"><img src="${this.image}" class="card-img-top" alt="..."><p>${this.title}</p></a></div>`
})

hikingTrailSchema.post('findOneAndDelete', async function (doc){
  if (doc){
    await Review.remove({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Trail', hikingTrailSchema);