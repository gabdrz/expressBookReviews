const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user already exists
        if (users.find(user => user.username === username)) {
            return res.status(409).json({message: "User already exists!"});
        } else {
            // Add the new user to the users array
            users.push({ username, password });
            return res.status(201).json({message: "User successfully registered. Now you can login"});
        }
    }
    // Return error if username or password is missing
    return res.status(400).json({message: "Username and password are required."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 res.json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({message: "Book not found"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  
  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book && book.reviews) {
    res.json(book.reviews);
  } else if (book) {
    res.status(404).json({message: "No reviews found for this book"});
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
