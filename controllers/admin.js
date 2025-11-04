const Product = require('../models/product');
const { validationResult } = require('express-validator');

const ITEMS_PER_PAGE = 3;

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddProduct = async (req, res, next) => {
    const { title, price, description } = req.body;
    const image = req.file;

    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: { title, price, description },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: { title, price, description },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;

    try {
        const product = new Product({
            title, price, description, imageUrl, userId: req.user
        });
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit === 'true';
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postEditProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    const { title: updatedTitle, price: updatedPrice, description: updatedDesc } = req.body;
    const image = req.file;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: { _id: prodId, title: updatedTitle, price: updatedPrice, description: updatedDesc },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    try {
        const product = await Product.findById(prodId);
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        if (image) {
            product.imageUrl = image.path;
        }
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        
        const options = {
            page: page,
            limit: ITEMS_PER_PAGE,
            sort: { createdAt: -1 } 
        };

        const result = await Product.paginate({ userId: req.user._id }, options);
        
        res.render('admin/products', {
            prods: result.docs,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            currentPage: result.page,
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPrevPage,
            nextPage: result.nextPage,
            previousPage: result.prevPage,
            lastPage: result.totalPages,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        const prodId = req.body.productId;
        await Product.deleteOne({ _id: prodId, userId: req.user._id });
        res.redirect('/admin/products');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};