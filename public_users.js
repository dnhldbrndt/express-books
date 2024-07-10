const express = require('express');
const public_users = express.Router();

let books = require("./books.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login." });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user." });
});

public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found by that author." });
  } else {
    return res.status(200).json(booksByAuthor);
  }
});

public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "No books found with that title." });
  } else {
    return res.status(200).json(booksByTitle);
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;