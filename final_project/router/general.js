const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(books);
})

public_users.get('/users',function (req, res) {
    res.send(users);
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const { isbn} = req. params
    const requestedBook = books [isbn]
    if (requestedBook)
        return res.send(requestedBook);
    else
        return res.status (300). json ({message:"Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const { author } = req. params
    
    if (!author)
        return res.status(400).json({ message: "Author query parameter is required" });
    
        const filteredBooks = Object.entries(books).filter(([_, book]) => book.author.toLowerCase() === author.toLowerCase())
    .map(([id, book]) => ({ id,...book}));
    
    if (filteredBooks.length === 0) {
        return res.status (404).json({ message: "No books found by that author" }) ;
    }

    return res.json(filteredBooks)
});

// Get all books based on title
// Had to change it to query, because having problem with space between words with curl
// Only worked after changing to query
public_users.get('/title', function (req, res) {
    const { title } = req.query;
    
    if (!title)
    return res.status(400).json({message: "Title is required" });
    
    const filteredBooks = Object.entries(books).filter(([_, book]) => book.title.toLowerCase() === title.toLowerCase())
    .map(([id, book]) => ({ id,...book}));
    
    if (filteredBooks. length===0)
        return res.status (404).json({ message: "No books found by that title" });

    return res.json (filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn} = req. params
    const requestedBook = books[isbn].reviews
    
    if(requestedBook)
        if (Object.keys(requestedBook).length === 0)
            return res.status(300).json({message: "Book has no reviews."}) ;
        else
            return res.send (requestedBook);
    else
        return res.status(300).json({message: "Yet to be be implemented"});
});

//Task 10
const axios = require('axios');

async function task10() {
    try {
      const response = await axios.get("http://localhost:5002/");
      console.log("Book details:", response.data);
    } catch (error) {
      console.error("Error fetching book by ISBN:", error.response?.data || error.message);
    }
}

//Task 11
async function task11(isbn) {
    try {
      const response = await axios.get(`http://localhost:5002/isbn/${isbn}`);
      console.log("Book details:", response.data);
    } catch (error) {
      console.error("Error fetching book by ISBN:", error.response?.data || error.message);
    }
}

//Task 12
async function task12(author) {
    try {
      const response = await axios.get(`http://localhost:5002/author/${author}`);
      console.log("Book details:", response.data);
    } catch (error) {
      console.error("Error fetching book by author:", error.response?.data || error.message);
    }
}

//Task 13
async function task13(title) {
    try {
      const response = await axios.get(`http://localhost:5002/title?title=${title}`);
      console.log("Book details:", response.data);
    } catch (error) {
      console.error("Error fetching book by title:", error.response?.data || error.message);
    }
}

module.exports.general = public_users;