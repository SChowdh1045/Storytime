import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import dotenv from "dotenv";
import morgan from "morgan";
import exphbs from "express-handlebars";
import router1 from "./routes/index.js";
import router2 from "./routes/auth.js";
import router3 from "./routes/stories.js";
import methodOverride from "method-override";
import passport from 'passport';
import passportFunction from "./config/passport.js";
import session from "express-session";
import MongoStore  from "connect-mongo";
import connectDB from "./config/db.js";
import {formatDate, truncate, stripTags, editIcon, select} from "./helpers/hbs.js"

//Load Config
dotenv.config({path: './config/config.env'});

//Passport Config
passportFunction(passport);

//Connecting to DB
connectDB();

// Creating express object
const app = express();

// Body Parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Method override
app.use(methodOverride( (req, res) => {
      if(req.body && typeof req.body === 'object' && '_method' in req.body){
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//Logging info to console
app.use(morgan('dev'));

//Handlebars
app.engine('.hbs', exphbs.engine({helpers: {formatDate, truncate, stripTags, editIcon, select}, defaultLayout: "main", extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Set Global var for editIcon
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//Static Folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', router1)
app.use('/auth', router2)
app.use('/stories', router3)

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`));