const mongoose = require('mongoose');
const debug = require('debug')("development:mongoose"); // namespace
const config = require('config');

mongoose.connect(`${config.get("MONGODB_URI")}/bagEcom`)
.then(() => {
    debug("connected to mongodb");
})
.catch((err) => {
    debug("❌ MongoDB connection error:", err);
})

module.exports = mongoose.connection;
// this will allow to use the connection over all the models

// for using debug we have to export it first and set 
// environment variable as follows 
// export DEBUG=app:*

// if we don't want to show DEBUG then just set : export DEBUG=