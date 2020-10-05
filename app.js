const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/booklistDB',{
  useNewUrlParser: true
});

const bookSchema = {
  title: String,
  author: String,
  genre: String,
  info: String,
  day: String
}

const Book = mongoose.model('Book', bookSchema);

const book1 = new Book({
  title: "Title",
  author: "Author",
  genre: "Genre",
  info: "Info",
  day: "The Time to Read is  Now"
});

//add design
//functionality is there
//learn to deploy
//continue with  Udemy
app.get("/",function(req,res){
  res.render('home');
});

app.get("/add",function(req,res){
  res.render('add');
});

app.post("/add",function(req,res){
//use post if you want to post info from the body
  const dayPosted = date.getDate();

  const anotherBook = new Book({
    title: req.body.bookTitle,
    author: req.body.bookAuthor,
    genre: req.body.bookGenre,
    info: req.body.bookInformation,
    day: dayPosted
  });

  anotherBook.save();
  res.redirect('/bookview');
});

app.get("/info/:bookname",function(req,res){

//use req.params in get and req.body in post
//  const day = date.getDate();

  const requestedTitle = req.params.bookname;

  console.log(requestedTitle);

  Book.findOne({title: requestedTitle},function(err,found){
    if(!err){
      if(!found){
        console.log("Not Found");
        res.redirect("/bookview");
      } else{
        res.render('info',{
          title: found.title,
          info: found.info,
          date: found.day
        });
      }
    } else{
      console.log(err);
    }
  });

});

app.get("/bookview",function(req,res){

    Book.find({},function(err,found){
      if(found.length === 0 ){
        Book.create(book1, function(error){
          if(err){
            console.log(err);
          } else{
            console.log("Inserted");
          }
        });
        res.redirect("/bookview");
      } else{
        res.render('bookview',{
          newBooks:  found
        });
      }

    });

});


app.get("/update/:bookname",function(req,res){

  const bookToUpdate = req.params.bookname;

  Book.findOne({title: bookToUpdate},function(err,found){
    if(!err){
      if(!found){
        console.log("Not Found");
        res.redirect("/bookview");
      } else{
        res.render('update',{
          title: found.title,
          author: found.author,
          genre: found.genre,
          info: found.info
        });
      }
    } else{
      console.log(err);
    }
  });

});

//fix update
app.post("/update",function(req,res){

//need reference  point what specific entry the book is updated
//find it first in terms of book Name and then try to update model
//maybe just  update the whole model or provide checkboxes to update
// if there is no value in textbox, return the original data. Use EJS

const bookToUpdate = req.body.bookName;


Book.findOneAndUpdate({title:  bookToUpdate}, {$set: {
  title: req.body.bookTitle,
  author: req.body.bookAuthor,
  genre: req.body.bookGenre,
  info: req.body.bookInformation
}} , function(err,found){
  if(!err){
    if(!found){
      console.log("Not found");
    } else{
      console.log("Updated");
      res.redirect("/bookview");
    }
  } else{
    console.log(err);
  }
});

});

app.post("/delete",function(req,res){
  const toDelete = req.body.bookName;

    Book.deleteOne({title: toDelete},function(err){
      if(err) console.log(err);
      res.redirect("/bookview");
    });

});

//deploy application
//refactor if needed

app.listen(3000,function(req,res){
  console.log("Server started at port 3000");
});
