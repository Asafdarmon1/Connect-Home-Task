// Description: This file sets up an Express.js server with routes for items, categories, and individual items.
const express = require('express');
const itemsRoutes = require('./api/routes/items'); // import the items routes
const categoryRoutes = require('./api/routes/category'); // import the category routes
const itemRoutes = require('./api/routes/item'); // import the item routes
const apiKeyAuth = require('./apiKeyAuth');
const app = express(); // create an instance of express
const PORT = process.env.PORT || 3000;

app.use(express.json()); // parse incoming request bodies in JSON format
// each request that comes to the server will go through this middleware
app.use(apiKeyAuth)

app.use('/items', itemsRoutes); // items routes will be handled by itemsRoutes
app.use('/item', itemRoutes); // item routes will be handled by itemRoutes
app.use('/category', categoryRoutes); // category routes will be handled by categoryRoutes

app.use((req, res, next) => {
    const error = new Error('Route ' + req.path + ' not found, please try again!');
    error.status = 404; // 404 error (Not Found) means the requested resource could not be located on the server
    next(error); // pass the error to the next middleware
});

// used to handle different kind of errors in the application (error thrown by the database, etc.)
app.use((error, req, res, next) => {
    if(error.code === 'ER_DUP_ENTRY'){ // check if the error is a duplicate entry error
        return res.status(409).json({
            success: false,
            status: 409, // 409 Conflict
            message: 'Duplicate entry detected'
        });
    }
    return res.status(error.status || 500).json({
        success: false, // indicate that the request was not successful
        status: error.status || 500, // set the status code to the error status or 500 if not defined
        message: error.message || 'Internal Server Error' // set the error message or a default message
    });
});

// listen on port 3000 for incoming requests
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT); // log a message to the console when the server is running
});

module.exports = app; // export the app instance for use in other files