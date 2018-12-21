const mongoose = require('mongoose');

/* this module through we are achieve an email validation*/
var uniqueValidator = require('mongoose-unique-validator');

// Model schema defined here
const UserDetails = mongoose.Schema({
	"firstName" : {"type":String, "required":true, "trim":true},
	"lastName"  : {"type":String, "required":true, "trim":true},
	"roles" : {"type":String, "required":true, "trim":true},
	"email" : {type: String, index: true, unique: true, required: true},
	"password" : {"type":String, "required":true, "trim":true},
	"phoneNo" : {"type":String},
	"city" : {"type":String},
	"state" : {"type":String},
	"country" : {"type":String},
	"isActive" : {"type":Boolean , "default" : 1},
	"created_at" : Date
},{
	timestamps: true
});

//here you can assign module in model schema for validation
UserDetails.plugin(uniqueValidator);

module.exports = mongoose.model('UserDetails',UserDetails);