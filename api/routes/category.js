// Description: Handels the requests to the /category endpoint
const express = require('express');
const router = express.Router(); // sub package of express to handle routes
const pool = require('../../db'); // import the database connection pool

router.get('/:id', async(req, res, next) => {

    const categoryId = req.params.id; // get the item id from the request parameters
    try{
        const [categoryRows] = await pool.query(
            'SELECT * FROM categories WHERE id = ?', 
            [categoryId]
        );

        if(categoryRows.length === 0){ // check if the category exists
           return res.status(404).json({
                success: false,
                code: 404,
                message: 'Category not found'
            });
        }

        const category = categoryRows[0]; // get the first category from the result set
        const [itemsRows] = await pool.query(
            'SELECT * FROM items WHERE categoryId = ?', 
            [categoryId]
        );

        res.status(200).json({
            success: true,
            code: 200,
            data: {
                    category: {
                            id: category.id, 
                            name: category.name, 
                            items: itemsRows // return the items associated with the category
                        }
            }
        });
    }catch(error){
        next(error); // pass the error to the next middleware
    }      
});

router.post('/', async(req, res, next) => {
    const item = {
        name: req.body.name, // get the category name from the request body
    }

    // validate the incoming data - not empty
    if(!item.name || typeof item.name !== 'string' || item.name.trim() === ''){
        return res.status(400).json({
            success: false,
            code: 400, // 400 Bad Request
            message: 'Invalid category name'
        });
    }
    
    try{
        const [categoryResult] = await pool.query(
            'INSERT INTO categories (name) VALUES (?)',
            [item.name.trim()]
        )
        res.status(200).json({
            success: true,
            code: 200, // 200 succeeded
            data: {
                id: categoryResult.insertId, // return the id of the newly created category
                name: item.name
            },
            message: 'Category created successfully'
        })
    }catch(error){
        next(error); // pass the error to the next middleware
    }
});

module.exports = router; // export the router instance for use in other files