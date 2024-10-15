const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Using a Promise to simulate async behavior
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No books found");
      }
    });
  };

  getBooks()
    .then(books => res.json(books))
    .catch(error => res.status(500).json({ message: error }));
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Using async/await
  const getBookByISBN = async (isbn) => {
    if (books[isbn]) {
      return books[isbn];
    } else {
      throw new Error("Book not found");
    }
  };

  getBookByISBN(isbn)
    .then(book => res.json(book))
    .catch(error => res.status(404).json({ message: error.message }));
});

// Task 12: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  // Using async/await
  const getBooksByAuthor = async (author) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      return booksByAuthor;
    } else {
      throw new Error("No books found for this author");
    }
  };

  getBooksByAuthor(author)
    .then(books => res.json(books))
    .catch(error => res.status(404).json({ message: error.message }));
});

// Task 13: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Using a Promise
  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    });
  };

  getBooksByTitle(title)
    .then(books => res.json(books))
    .catch(error => res.status(404).json({ message: error }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.json(books[isbn].reviews);
});

module.exports.general = public_users;