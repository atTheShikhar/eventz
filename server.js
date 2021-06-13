const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth.route');
const metaRouter = require('./routes/meta.route');
const eventsRouter = require('./routes/events.route');
const searchRouter = require('./routes/search.route');
const ticketRouter = require('./routes/tickets.route');
const adminRouter = require('./routes/admin.route');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
//Initializing Enviroment variable
dotenv.config({
    path: './configs/config.env'
});

//Initialize Express App
const app = express();

//Mongoose Connection
mongoose.connect(process.env.MONGO_CONNECTION_URI,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch(error => {
    console.log("Error connecting to database! " + error);
});
//Mongoose error handling
mongoose.connection.on("error", err => {
    console.log(`Error: ${err}`);
});

//middleware to parse the body of the request to json
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
//Enables all cors requests
app.use(cors());

// app.use((req,res,next) => {
//     res.header("Access-Control-Allow-Origin","http://localhost:3000");
//     res.header("Access-Control-Allow-Headers","Content-Type");
//     res.header("Access-Control-Allow-Credentials","true");
//     if(req.method === "OPTIONS") {
    //         res.header("Access-Control-Allow-Methods","PUT,POST,GET,PATCH,DELETE");
    //         return res.status(200).json({});
    //     }
    //     next();
// })

app.use(express.static('public'))

//Routes
app.use("/api",
    adminRouter,
    authRouter,
    metaRouter,
    eventsRouter,
    ticketRouter,
    searchRouter
);


//Listening
const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`Listening at ${PORT}`)
})