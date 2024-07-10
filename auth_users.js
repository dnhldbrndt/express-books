const express = require('express');
const regd_users = express.Router();
const jwt = require('jsonwebtoken');
let books = require("./books.js");

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in!" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });

    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in." });
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password!" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const { review } = req.body;
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    book.reviews[username] = review;
    return res.status(200).json({ message: "Book review successfully added or modified." });
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const { isbn } = req.params;
  const book = books[isbn];

  if (book && book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: `Review from ${username} deleted.` });
  } else if (book && !book.reviews[username]) {
    return res.status(404).json({ message: `No review from ${username} to delete.` });
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;