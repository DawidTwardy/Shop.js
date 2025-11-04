const fs = require("fs");
const path = require("path");

const Product = require("../models/product");
const Order = require("../models/order");
const courseConfig = require("../course.json");
const User = require("../models/user")

exports.getIndex = (req, res, next) => {
    res.render("shop/index", {
        pageTitle: "Market",
        path: "/",
        studyLevel: courseConfig.studyLevel,
        classesName: courseConfig.classesName,
    });
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "Products",
            path: "/products"
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);
        if (!product) {
            throw new Error("Product does not exist.");
        }
        res.render("shop/product-detail", {
            product: product,
            pageTitle: product.title,
            path: "/products",
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const user = await User
            .findById(req.session.user._id)
            .populate("cart.items.productId");

        const products = user.cart.items;
        
        res.render("shop/cart", {
            path: '/cart',
            pageTitle: "Your Cart",
            products: products,
        });
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    }
}

exports.postCart = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const product = await Product.findById(prodId);
        if (!product) {
            throw new Error("Product not found.")
        }
        const user = await User.findById(req.session.user._id);
        await user.addToCart(product)
        res.redirect("/cart")
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500
        return (next(error))
    }
}

exports.postCartDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const user = await User.findById(req.session.user._id);
        await user.removeFromCart(prodId);
        res.redirect("/cart")
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error)
    }
}

exports.postOrder = async (req, res, next) => {
    try {
        const user = await User
            .findById(req.session.user._id)
            .populate('cart.items.productId');
        
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
        });

        const order = new Order({
            user: {
                email: req.session.user.email,
                userId: req.session.user
            },
            products: products
        });

        await order.save();
        await user.clearCart();
        res.redirect('/orders');

    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ 'user.userId': req.session.user._id });
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

exports.getOrder = async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new Error('No order found.'));
        }
        if (order.user.userId.toString() !== req.session.user._id.toString()) {
            return next(new Error('Unauthorized.'));
        }
        res.render('shop/order-detail', {
            order: order,
            pageTitle: 'Order Detail',
            path: '/orders'
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};