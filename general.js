const express = require('express');
const public_users = express.Router();

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

public_users.post("/register", (req,res) => {
 
 
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User succesfully registered. Now you can login."});
    } else {
        return res.status(404).json({messgage: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});

});

 
public_users.get('/',function (req, res) {
 
  return res.send(JSON.stringify(books,null,4));
});

 
public_users.get('/isbn/:isbn',function (req, res) {
 
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({message: "Book not found."});
  }
 });
  
 
public_users.get('/author/:author',function (req, res) {
 
  const booksByAuthor = []
  Object.keys(books).forEach(key => {
    if ( books[key].author === req.params.author){
        booksByAuthor.push(books[key]);
    }
    });
    if (booksByAuthor.length === 0) {
        return res.status(404).json({message: "No books found."});  
    }  else {
    return res.send(booksByAuthor);
     }
});

 
public_users.get('/title/:title',function (req, res) {
 
  const booksByTitle = []
  Object.keys(books).forEach(key => {
    if ( books[key].title === req.params.title){
        booksByTitle.push(books[key]);
    }
    });    
    if (booksByTitle.length === 0) {
        return res.status(404).json({message: "No books found."});  
    }  else {
        return res.send(booksByTitle);
     }

});

 
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      return res.status(404).json({message: "Book not found."});
    }
});

module.exports.general = public_users;
