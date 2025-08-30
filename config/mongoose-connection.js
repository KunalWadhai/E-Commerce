const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/bagEcom")
.then(() => {
    console.log("connected")
})
.catch((err) => {
    console.log(err);
})

module.exports = mongoose.connection;
// this will allow to use the connection over all the models
