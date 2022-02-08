const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const cors = require('cors');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(bodyParser.json());

//Mongo Connection
const MongoClient =require("mongodb").MongoClient
const url='mongodb://127.0.0.1:27017';
const dbName='Blog';
let db
MongoClient.connect(url, {useUnifiedTopology: true},(err,client) => {
        if(err) return console.log(err);
        db=client.db(dbName); 
        console.log(`Connected Database: ${url}`);
        console.log(`Database : ${dbName}`);
});

app.set('views', './views');
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    db.collection('data').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('home.ejs', { data: result })
        // res.json(result);
    })
    // res.render('home.ejs')
})

//Add
app.get('/Create', (req, res) => {
    res.render('add.ejs')
})
var authorid="";
var author="";
var title="";
var conten="";
app.post('/AddData',(req,res)=>{
    console.log(req.body.authorid);
    authorid = req.body.authorid;
    author =req.body.author;
    title = req.body.title;
    content =req.body.content;
  
    var d = {
        "authorid": authorid,
        "author":author,
        "title":title,
        "content":content
    }
    db.collection('data').insertOne(d,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
          
    return res.redirect('/');
})
// Edit button
app.get('/editbutton', (req, res) => {
    var a=req.query.authorid;
    //console.log(a);
    res.render('editblog.ejs',{aid:a})
})
app.post('/editblog',(req,res)=>{
    console.log(req.body.authorid);
    db.collection('data').findOneAndUpdate({authorid:req.body.authorid},{$set:{title:req.body.title,content:req.body.content}},(err,result)=>{
        if(err) return res.send(err)
        console.log(req.body.authorid+' blog updated')
        res.redirect('/')
    })
})

// // Edit button
// app.get('/editbutton', (req, res) => {
//     var a=req.params.id;
//     db.collection('data').find({_id:a},(err, result) => {
//         if (err) return console.log(err)
//         // res.render('home.ejs', { data: result })
//         res.json(result);
//     })
    
// })
// app.post('/editblog',(req,res)=>{
//     console.log("in api");
//     console.log(req.query.id);
//     db.collection('data').findOneAndUpdate({_id:req.query.id},{$set:{title:req.body.title,content:req.body.content}},(err,result)=>{
//         if(err) return res.send(err)
//         console.log(req.body.authorid+' blog updated')
//         res.redirect('/')
//     })
// })

// Delete button
app.get('/deletebutton',(req,res)=>{
    var a = req.query.authorid;
    db.collection('data').deleteOne({authorid:a});
    console.log("record deleted");
      res.redirect('/');
    })

app.listen(4000,() => {
    console.log('listening on 4000')
});