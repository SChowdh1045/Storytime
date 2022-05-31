import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import dotenv from "dotenv";
import morgan from "morgan";
import exphbs from "express-handlebars";
import router1 from "./routes/index.js";
import router2 from "./routes/auth.js";
import passport from 'passport';
import passportFunction from "./config/passport.js";
import session from "express-session";
import MongoStore  from "connect-mongo";
import connectDB from "./config/db.js";

//Load Config
dotenv.config({path: './config/config.env'});

//Passport Config
passportFunction(passport);

//Connecting to DB
connectDB();

// Creating express object
const app = express();

//Logging info to console
app.use(morgan('dev'));

//Handlebars
app.engine('.hbs', exphbs.engine({defaultLayout: "main", extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Static Folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', router1)
app.use('/auth', router2)

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`));