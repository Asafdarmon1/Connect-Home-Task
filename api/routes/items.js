// Description: Handels the requests to the /items endpoint
const express = require('express');
const router = express.Router(); // sub package of express to handle routes
const pool = require('../../db'); // import the database connection pool
const e = require('express');

router.get('/', async(req, res, next) => {
   try{
        const  [itemsRows] = await pool.query(
            'SELECT * FROM items'
        );

        if(itemsRows.length === 0){
            return res.status(404).json({
                success: false,
                code: 404, // 404 Not Found
                message: 'No items found'
            });
        }

        return res.status(200).json({
            success: true,
            code: 200,
            data: {
                items: itemsRows // return the items
            }
        });
    } catch (error) {
        next(error); // pass the error to the next middleware
    }   
});

router.post('/', async(req, res, next) => {
    
    const item = req.body; // get the item properties from the request body (including the volumes array)

    // validate the incoming data - not empty
    if(!item.name || !item.price || !item.categoryId || !Array.isArray(item.volumes)){
        return res.status(400).json({
            success: false,
            code: 400, // 400 Bad Request
            message: 'Invalid item data'
        });
    }

    // validate name data
    if(typeof item.name !== 'string' || item.name.trim() === ''){
        return res.status(400).json({
            success: false,
            code: 400, // 400 Bad Request
            message: 'Invalid item name'
        });
    }

    // validate price data
    if(typeof item.price !== 'number' || item.price <= 0){
        return res.status(400).json({
            success: false,
            code: 400, // 400 Bad Request   
            message: 'Invalid item price'
        });
    }

   // validate category data
    if(item.categoryId < 0){
        return res.status(400).json({
            success: false,
            code: 400, // 400 Bad Request
            message: 'Invalid category ID'
        });
    }
    
    const [existingCategory] = await pool.query(
        'SELECT * FROM categories WHERE id = ?',
        [item.categoryId]
    );
    if(existingCategory.length === 0){
        return res.status(404).json({
            success: false,
            code: 404, // 404 Not Found
            message: 'Category not found'
        });
    }

    // check if the item already exists in the database
    const [existingItem] = await pool.query(
        'SELECT * FROM items WHERE name = ?',
        [item.name.trim()]
    );
    // if the item already exists, we need to check if the volumes are the same - if so, update the current volume
    // update the item if it exists, otherwise insert a new item
    if(existingItem.length > 0){
        item.id = existingItem[0].id; // if the item already exists, we get its ID   
        for(const volume of item.volumes){
            // check if the volume already exists in the database
            const [existingVolume] = await pool.query(
                'SELECT * FROM items_volumes WHERE itemId = ? AND value = ?',
                [item.id, volume.value.trim()]
            );     

            // if items_volumes already has a volume with the same name, we are updating the volume price
            if(existingVolume.length > 0){
                // update the volume price if it exists
                try{
                    await pool.query(
                        'UPDATE items_volumes SET price = ? WHERE itemId = ? AND value = ?',
                        [volume.price, item.id, volume.value.trim()]
                    );
                }catch(error){
                    return next(error); // pass the error to the next middleware
                }
            }else{
                try{
                    const [existingVolumeByPrice] = await pool.query(
                        'SELECT * FROM items_volumes WHERE itemId = ? AND price = ?',
                        [item.id, volume.price]
                    );
                    // if we have a volume with the same price, we cannot insert a new volume
                    if(existingVolumeByPrice.length > 0){
                        return res.status(400).json({
                            success: false,
                            code: 400, // 400 Bad Request
                            message: 'Volume with price ' + volume.price + ' already exists'
                        });
                    }
                    // if the volume does not exist, we need to insert it into the databas               
                    await pool.query(
                        'INSERT INTO items_volumes (itemId, value, price) VALUES (?, ?, ?)',
                        [item.id, volume.value.trim(), volume.price]
                    );
                }catch(error){
                   return next(error); // pass the error to the next middleware
                }
            }

        } 
        
        try{ // update the item in the database
            await pool.query(
               'UPDATE items SET price = ?, categoryId = ? WHERE id = ?',
               [item.price, item.categoryId, item.id]
            );
        }catch(error){
            return next(error); // pass the error to the next middleware
        }
        return res.status(200).json({
                success: true,
                code: 200,
                data: {
                    name: item.name,
                    price: item.price,
                    categoryId: item.categoryId,
                    volumes: item.volumes
                }
            });
    }    

    // if the item does not exist, we need to insert it into the database
    try {
        // insert the item into the database
        const [result] = await pool.query(
            'INSERT INTO items (name, price, categoryId) VALUES (?, ?, ?)',
            [item.name, item.price, item.categoryId]
        );

        // get the inserted item's ID
        const itemId = result.insertId; // this is the ID of the newly inserted item

        // insert volumes into the volumes table
        for(const volume of item.volumes){
            await pool.query(
                'INSERT INTO items_volumes (itemId, value, price) VALUES (?, ?, ?)',
                [itemId, volume.value.trim(), volume.price]
            );
        }
        
        return res.status(200).json({
            success: true,
            code: 200,
            data: {
                name: item.name,
                price: item.price,
                categoryId: item.categoryId,
                volumes: item.volumes
            },
        });
    } catch (error) {
        next(error); // pass the error to the next middleware
    }
});

module.exports = router; // export the router instance for use in other files