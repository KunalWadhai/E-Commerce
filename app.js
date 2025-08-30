const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

const db = require('./config/mongoose-connection');

const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');
const userModel = require('./models/user-model');

// forward as per the specific routes
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);


// app.get('/', (req, res) => {
//     res.send("Working");
// });

// testing model working properly.
// app.get('/create',async (req, res) =>{
//     let user = await userModel.create({
//         fullname : "Kunal Wadhai",
//         email : "kunalwadhai111@gmail.com",
//         password : "124"
//     });
//     res.send(user);
// });

app.listen(3000, () => {
    console.log("Server running on the port 3000")
});



