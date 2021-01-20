const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


// Importing routers
// const typeRoutes = require('./routes/type');
// const authorRoutes = require('./routes/author');
const indexRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

// App config
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

// Routes Config:
app.use('/user', indexRoutes);
// app.use('/type', typeRoutes);d
// app.use('/author', authorRoutes);
app.use('/book', bookRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

