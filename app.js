const express = require('express')
const userRoutes = require('./src/routes/userRoutes')
const blogRoutes = require('./src/routes/blogRoutes')
require("dotenv").config();
const dbConnection = require('./conn')


const app = express()
const port = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(port, () => {
  console.log(`listening on port ${port}`)
  dbConnection();
})

app.use('/user', userRoutes)
app.use('/blog', blogRoutes)