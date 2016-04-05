var mongoose = require("mongoose");

//connect to database
var db = mongoose.connect('mongodb://toboklee:12345@ds011880.mlab.com:11880/stampcontent');

// replicate instagram data structure.
var instaSchema = new mongoose.Schema({
  id: String,
  type: String,
  filter: String,
  created_time: Date,
  user_has_liked: Boolean,
  images: {
    low_resolution: { 
	url: String,
     	width: Number,
     	height: Number 
    }
  }
});

module.exports = db.model('insta', instaSchema);
