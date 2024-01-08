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
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

public_users.get('/', async (req, res) => {
    const response = await axios.get('https://andrefs894-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
    const books = response.data;
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]));
 });

public_users.get('/isbn/:isbn', async (req, res) => {
    isbn = req.params.isbn;
    const response = await axios.get('https://andrefs894-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}');
    const books = response.data;
    res.send(JSON.stringify(books));
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const rbooks = {};
    for (const key in books) {
      if (books[key].author === author) {
        rbooks[key] = books[key];
      }
    }
    res.send(JSON.stringify(rbooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const rbooks = {};
    for (const key in books) {
      if (books[key].title === title) {
        rbooks[key] = books[key];
      }
    }
    res.send(JSON.stringify(rbooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
