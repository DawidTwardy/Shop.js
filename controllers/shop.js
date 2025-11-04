const Product = require('../models/product');

const ITEMS_PER_PAGE = 3;

// DODANO STAŁE DLA KONTEKSTU WIDOKU /views/shop/index.ejs
const STUDY_LEVEL = 'I (Inżynierski)';
const CLASSES_NAME = 'Programowanie back-end';

exports.getProducts = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const totalItems = await Product.find().countDocuments();
        const products = await Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getIndex = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const totalItems = await Product.find().countDocuments();
        const products = await Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            // PRZEKAZANIE BRAKUJĄCYCH ZMIENNYCH DLA index.ejs
            studyLevel: STUDY_LEVEL,
            classesName: CLASSES_NAME,
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const prodId = req.params.productId;
        const product = await Product.findById(prodId);
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        // POPRAWKA: Usunięto .execPopulate(), używając await na populate()
        const user = await req.user.populate('cart.items.productId'); 
        const products = user.cart.items;
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postCart = async (req, res, next) => {
    try {
        const prodId = req.body.productId;
        const product = await Product.findById(prodId);
        await req.user.addToCart(product);
        res.redirect('/cart');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
    try {
        const prodId = req.body.productId;
        await req.user.removeFromCart(prodId);
        res.redirect('/cart');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.postOrder = async (req, res, next) => {
    try {
        await req.user.addOrder();
        res.redirect('/orders');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders();
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};