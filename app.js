require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;
//DB
const db = require('./config/database') 
db.authenticate()
    .then(()=> console.log("Database connected"))
    .catch(err => console.log("Error" + err));

//Routes
app.use('/user', userRoutes);

//Server configs
app.use((req,res,next)=> {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
app.listen(port, () => console.log("Server is connected and running..."));

module.exports = app;

///{
    //"firstname": "Ammar",
    //"lastname": "Khatri",
    //"email": "m",
    //"password": "123",
    //"country": "Pak",
   // "status": "A",
  //  "phonenumber": "200"
//}