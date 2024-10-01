const mongoose = require('mongoose');

const devuser = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    societyname:{
        type:String,
        required:true, 
    },
    societyaddress:{
        type:String,
        required:true, 
    },
    city:{
        type:String,
        required:true, 
    },
    district:{
        type:String,
        required:true, 
    },
    postalcode:{
        type:Number,
        required:true, 
    },
    flatno:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true, 
    },
    confirmpassword:{
        type:String,
        required:true, 
    }
})

module.exports = mongoose.model('devuser', devuser)