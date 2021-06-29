const express = require("express");
const path = require("path");
const http= require("http")
const app = express();
const bodyparser = require("body-parser");

//database.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/patient', {useNewUrlParser: true, useUnifiedTopology: true});
const port = 8000;

//DEFINE MONGOOOSE SCHEMA model
const patientschema = new mongoose.Schema({
    name: String,
    age: String,
    idno: String,
    gender: String,
    phone: String,
    date: String
});
var patient = mongoose.model('patient', patientschema);


// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory


// ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);
})
app.get('/patient', (req, res)=>{
    const params = {}
    res.status(200).render('patient.pug', params);
})
app.get('/Pinfo', (req, res)=>{
    const params = {}
    res.status(200).render('Pinfo.pug', params);
})
app.get('/faq', (req, res)=>{
    const params = {}
    res.status(200).render('faq.pug', params);
})
app.get('/gen', (req, res)=>{
    const params = {}
    res.status(200).render('gen.pug', params);
})

app.get('/staff', async(req, res)=>{
    var params={}
    const result= await patient.find().exec();
    console.log(result);
    res.status(200).render('staff.pug',{"result":result});
})
app.post('/patient', (req, res)=>{
    var mydata = new patient(req.body);
    mydata.save().then(()=>{
        res.send("This item has been saved to the database")
    }).catch(()=>{
        res.status(400).alert("Item was not saved to the database")
    });
    res.status(200).render('thanks.pug');
})

app.post('/certi', async(req, res)=>{
    var params={}
    var data=req.body;
    var con=data.idno;
    console.log(con)
    const result= await patient.find({idno: con}).exec();
    res.status(200).render('certi.pug',result[0]);
})


// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});