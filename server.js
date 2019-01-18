const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());

const movieQuotesDb = {
  'd9424e04-9df6-4b76-86cc-9069ca8ee4bb': {
    id: 'd9424e04-9df6-4b76-86cc-9069ca8ee4bb',
    quote: 'Why so serious?',
    comments: ['70fcf8bd-6cb0-42f3-9887-77aa9db4f0ac'],
  },
  '27b03e95-27d3-4ad1-9781-f4556c1dee3e': {
    id: '27b03e95-27d3-4ad1-9781-f4556c1dee3e',
    quote: 'YOU SHALL NOT PASS!',
    comments: [],
  },
  '5b2cdbcb-7b77-4b23-939f-5096300e1100': {
    id: '5b2cdbcb-7b77-4b23-939f-5096300e1100',
    quote: "It's called a hustle, sweetheart.",
    comments: [],
  },
  '917d445c-e8ae-4ed9-8609-4bf305de8ba8': {
    id: '917d445c-e8ae-4ed9-8609-4bf305de8ba8',
    quote: 'The greatest teacher, failure is.',
    comments: [],
  },
  '4ad11feb-a76a-42ae-a1c6-8e30dc12c3fe': {
    id: '4ad11feb-a76a-42ae-a1c6-8e30dc12c3fe',
    quote: 'Speak Friend and Enter',
    comments: [],
  },
};

const quoteComments = {
  '70fcf8bd-6cb0-42f3-9887-77aa9db4f0ac': {
    id: '70fcf8bd-6cb0-42f3-9887-77aa9db4f0ac',
    comment: 'So awesome comment!',
  },
};

const usersDb = {
  'eb849b1f-4642-4c16-a77b-71ac2f90996f': {
    id: 'eb849b1f-4642-4c16-a77b-71ac2f90996f',
    name: 'Kent Cook',
    email: 'really.kent.cook@kitchen.com',
    password: 'cookinglessons',
  },
  '1dc937ec-7d71-4f37-9560-eef9d998a9b7': {
    id: '1dc937ec-7d71-4f37-9560-eef9d998a9b7',
    name: 'Phil A. Mignon',
    email: 'good.philamignon@steak.com',
    password: 'meatlover',
  },
};

// Functions

const createQuote = quote => {
  // need to create and id

  const id = uuidv1().substr(0, 6);

  // create a new quote object

  const newQuote = {
    id: id,
    quote: quote,
    comments: [],
  };

  // Add the new object to movieQuotesDB

  movieQuotesDb[id] = newQuote;
};

const deleteQuote = quoteId => {
  delete movieQuotesDb[quoteId];
};

const updateQuote = (quoteId, quote) => {
  // replace the quote content of the quote with quoteId
  movieQuotesDb[quoteId].quote = quote;
};

const authenticateUser = (email, password) => {
  // loop over the usersDb object
  // if not match is found, return false

  for (const userId in usersDb) {
    const user = usersDb[userId];
    // if the emails and passwords match, return the userId
    if (user.email === email && user.password === password) {
      return user.id;
    }
  }

  return false;
};

const createUser = (name, email, password) => {
  // create a new user object
  // Format:
  // {
  //   id: '1dc937ec-7d71-4f37-9560-eef9d998a9b7',
  //   name: 'Phil A. Mignon',
  //   email: 'good.philamignon@steak.com',
  //   password: 'meatlover',
  // }
  // generate a userId
  // create a new object following the same structure as above
  // add the object to the usersDb
  // return the userId
};

// End Points
app.get('/', function(req, res) {
  res.redirect('/quotes');
});

// Endpoints for managing the login

// Render the login page
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  // Extract email and password from the form

  const email = req.body.email;
  const password = req.body.password;
  // es6 destructuring:
  // const {email, password} = req.body;

  // Authenticate the user -> check if a user exists with this email and password

  const userId = authenticateUser(email, password);

  if (userId) {
    // If the user is authenticated -> login
    // Setting the cookie for that user
    // redirect to /quotes
    res.cookie('userId', userId);
    res.redirect('/quotes');
  } else {
    // If the user is not found
    // error message "Wrong Credentials" -> skipping this one for now
    // redirect to login
    res.redirect('/login');
  }
});

// Logout endpoint

app.delete('/logout', (req, res) => {
  res.cookie('userId', null);
  res.redirect('/quotes');
});

// Register

// Display the register form
app.get('/register', (req, res) => {
  templateVars = { currentUser: null };

  res.render('register', currentUser);
});

app.post('/users', (req, res) => {
  // extract the information from the form -> req.body -> name, email, password
  // create the user in the usersDb
  // userId = createUser(name, email, password)
  // set the cookie of that user
  // redirect to quotes
});

// List the quotes and the comments
app.get('/quotes', function(req, res) {
  // extract the userId from the cookies
  const userId = req.cookies.userId;
  // Retrieve the user with that userId in usersDb
  const currentUser = usersDb[userId];

  // currentUser is either:
  // 1. the user object
  // 2. undefined

  const templateVars = {
    quotes: movieQuotesDb,
    comments: quoteComments,
    currentUser: currentUser,
  };

  res.render('quotes', templateVars);
});

// Adding a new quote

// Display the new quote form

app.get('/quotes/new', (req, res) => {
  res.render('quote_new');
});

// Post the new quote data to movieQuotesDB

app.post('/quotes', (req, res) => {
  // extract the information from the form.

  const quote = req.body.quote;
  // es6 way:
  // const {quote} = req.body;

  // Add the new quote to movieQuotesDB

  createQuote(quote);

  // redirect to /quotes

  res.redirect('/quotes');
});

// Editing a quote

// display the update form
app.get('/quotes/:quoteId/update', (req, res) => {
  const quoteId = req.params.quoteId;
  // const {quoteId} = req.params;

  const templateVars = {
    quoteId: quoteId,
    quote: movieQuotesDb[quoteId].quote,
  };

  res.render('quote_update', templateVars);
});

// update the quote in the movieQuotesDB

app.put('/quotes/:quoteId', (req, res) => {
  // Extract the quote from the form
  const quoteId = req.params.quoteId;
  const quote = req.body.quote;

  console.log('quoteId: ', quoteId, 'quote: ', quote);
  // es6:
  // const {quoteId} = req.params;
  // const {quote} = req.body;

  // Update the quote in movieQuotesDB

  updateQuote(quoteId, quote);

  // Redirect to /quotes

  res.redirect('/quotes');
});

// Delete a quote

app.delete('/quotes/:quoteId', (req, res) => {
  // extract the quoteId from the url
  const { quoteId } = req.params;
  // delete the quote
  deleteQuote(quoteId);
  // redirect to /quotes
  res.redirect('/quotes');
});

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});
