'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns')
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;
process.env.DB_URI = "mongodb+srv://ducmpham17:Phamminhduc1@cluster0-misdy.mongodb.net/urlshort?retryWrites=true&w=majority" 

/** this project needs a db !! **/ 
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: false})) 
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

const schema = mongoose.Schema 
const dataSchema = new schema({
    url : String,
    number : Number
})
var pts = []
var Data = mongoose.model("Data",dataSchema)

const check = /^https?:\/\//;
// your first API endpoint... 
app.post("/api/shorturl/new",(req,res) => {
  const value = req.body.url;
  if(check.test(value)){
    var nextValue = value.slice(value.indexOf("//") + 2)
  }
  dns.lookup(nextValue,(err,addresses,family) => {
    if(err){
      const error = {error : 'invalid URL'}
      res.json(error)
    }
    else{
      var findUrl = Data.find({url : value},(err,result) => {
        if(err){
          console.log(err)
        }
        if(result.length > 0){
          res.json(result)
        }
        else{
      var num2 = Data.count({},(err,count) =>{
        if(err){
          console.log(err)
        }
       var data = new Data({
        url : value,
        number : count
      })
    
      data.save((err,d) => {
        if(err){
         console.log(err)
        }
      })
      res.json(data)
      })
      }
      })
      }
  })
})

app.get("/api/shorturl/:num",(req,res) => {
  var findUrl = Data.find({number: req.params.num},(err,result) =>{
    if(err){
      console.log(err)
    }
    console.log(result[0])
    if(result[0] != null){
      res.redirect(result[0].url)
    }
  })
})



app.listen(port, function () {
  console.log('Node.js listening ...');
});