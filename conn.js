const mongoose = require("mongoose");

const DB = process.env.DB_URI
const db = () => {
    mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("mongoDB Connected.....")).catch(err => console.error(err));
}

module.exports = db;