const express = require('express')
const userRoutes = require('./src/routes/userRoutes')
const dotenv = require("dotenv").config();
const dbConnection = require('./conn')


const app = express()
const port = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dbConnection();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/user', userRoutes)