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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.static('public'));

// Routes Config:
app.use('/user', indexRoutes);
// app.use('/type', typeRoutes);
// app.use('/author', authorRoutes);
app.use('/book', bookRoutes);

process.env.PORT = 8080;

app.listen(process.env.PORT || 8080, () =>{
    console.log(`Listen on port: ${(process.env.PORT) ? process.env.PORT : '8080'} `);
})

