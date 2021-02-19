const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Importing routers
const indexRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const authorRoutes = require('./routes/author');

// App config
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

// Routes Config:
app.use('/user', indexRoutes);
app.use('/book', bookRoutes);
app.use('/author', authorRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

