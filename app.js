const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const override = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const path = require('path')

require('dotenv/config')

// Main app
const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Method override middleware
app.use(
  override((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

// Flash
app.use(flash())

// Mongoose
mongoose.Promise = global.Promise
mongoose
  .connect('mongodb://localhost/vidjot', {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// Passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// Global Variabels
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// Handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: 'views/partials',
    layoutsDir: 'views/layouts'
  })
)
app.set('view engine', 'handlebars')

// Public files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/pages'))
app.use('/ideas', require('./routes/ideas'))

// Port
const port = process.env.PORT || 5000

// Connect to server
app.listen(port, () => console.log(`Server is running on port ${port}`))
