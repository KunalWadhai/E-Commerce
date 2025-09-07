const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

const isLoggedIn = require("./middlewares/isLoggedIn");
const db = require('./config/mongoose-connection');

const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const indexRouter = require('./routes/index');

const expressSession = require('express-session');
const flash = require('connect-flash');

// we require this to use all the variable of other stuff in .env file.
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
    
// we have use the middlewars as of flash message requires session 
// which need to be like below.
app.use(expressSession({
    resave : false,
    saveUninitialized : false,
    secret : process.env.EXPRESS_SESSION_SECRET
}));
app.use(flash());
app.set('view engine', 'ejs');

// forward as per the specific routes
app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);



app.listen(3000, () => {
    console.log("Server running on the port 3000")
});



