// Description: Handels the requests to the /item endpoint
const express = require('express');
const router = express.Router(); // sub package of express to handle routes
const pool = require('../../db'); // import the database connection pool

// it has to be before router.get('/:id'), otherwise it will not work
router.get('/search', async(req, res, next) => {

    const searchString = req.query.query; // get the search string from the request parameters - can be item or category
    
    if(!searchString || searchString.trim() === '') { //validate the search string
        return res.status(400).json({
            success: false,
            code: 400, // 400 Bad Request
            message: 'Search string is required'
        });
    }

    try{
        // searching for categories that matches the search string
        const [categories] = await pool.query(
            'SELECT * FROM categories WHERE name LIKE ?', 
            ['%' + searchString + '%']
        );

        // searching for items that matches the search string
        const [items] = await pool.query(
            'SELECT * FROM items WHERE name LIKE ?',  
            ['%' + searchString + '%']
        );

        // if no categories or items were found, return an empty array
        if(categories.length === 0 && items.length === 0) {
            return res.status(200).json({
                success: true,
                code: 200,
                data: {
                    categories: [],
                    items: []
                },
                message: 'No categories or items found'
            });
        }
        // if categories or items were found, return them
        return res.status(200).json({
            success: true,
            code: 200,
            data: {
                categories: categories, // return the categories that matches the search string
                items: items // return the items that matches the search string
            }
        });
    } catch (error) {
        next(error); // pass the error to the next middleware
    }   
    
});

router.get('/:id', async(req, res, next) => {

    const itemId = req.params.id; // get the item id from the request parameters
    try{
        const [itemRows] = await pool.query(
            'SELECT * FROM items WHERE id = ?', 
            [itemId]
        );

        if(itemRows.length === 0) { // check if the category exists
           return res.status(404).json({
                success: false,
                code: 404,
                message: 'Item not found'
            });
        }
        
        const item = itemRows[0]; // get the first item from the result set - to display it as a JSON and not an array
    
        const [itemVolume] = await pool.query(
            'SELECT * FROM items_volumes WHERE itemId = ?', 
            [itemId]
        )

        return res.status(200).json({
            success: true,
            code: 200,
            data: {
                id: item.id,
                name: item.name,
                volumes: itemVolume
            }
        });
    } catch (error) {
        next(error); // pass the error to the next middleware
    }
});

module.exports = router; // export the router instance for use in other files