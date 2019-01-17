const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

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

// End Points
app.get('/', function(req, res) {
  res.redirect('/quotes');
});

// List the quotes and the comments
app.get('/quotes', function(req, res) {
  const templateVars = { quotes: movieQuotesDb, comments: quoteComments };

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
