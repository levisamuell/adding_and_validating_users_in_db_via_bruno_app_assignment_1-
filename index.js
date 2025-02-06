const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./schema.js')
require('dotenv').config();

const mongoURL = process.env.DB_URL

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

mongoose.connect(mongoURL)
.then(() => {
  console.log('Successfully connected to the Database')
})
.catch((err) => {
  console.log('Error connecting to the Database', err)
})

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/add-user', async (req, res) => {
  const {username, email, password} = req.body;
try{
  if(!username || !email || !password){
    return res.status(400).json({ message: 'All fields are required'})
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const data = new UserModel({
    username: username,
    email: email,
    password: hash
  })
  await data.save();

  res.status(201).json({message: 'User added successfully'});
}
catch(err){
  res.status(500).json({ message: 'Internal Server Error'})
}
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
