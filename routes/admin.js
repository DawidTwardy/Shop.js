const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();

const productValidation = [
    body('title', 'Title must be text and at least 3 characters long.')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    
    body('price', 'Price must be a valid number.')
        .isFloat(),

    body('description', 'Description must be between 5 and 400 characters long.')
        .isLength({ min: 5, max: 400 })
        .trim()
];

router.get('/products', adminController.checkIsLogged, adminController.getProducts);

router.get('/add-product', adminController.checkIsLogged, adminController.getAddProduct );

router.post('/add-product', 
    adminController.checkIsLogged, 
    productValidation,
    adminController.postAddProduct 
);

router.get('/edit-product/:productId', adminController.checkIsLogged, adminController.getEditProduct);

router.post('/edit-product', 
    adminController.checkIsLogged, 
    productValidation,
    adminController.postEditProduct 
);
    
router.delete('/product/:productId', adminController.checkIsLogged, adminController.deleteProduct);

module.exports = router;