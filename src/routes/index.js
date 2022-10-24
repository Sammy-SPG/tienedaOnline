const { Router, request, response } = require('express');
const calculateOrderAmount = require('./calculateOrderAmount');
const env = require('dotenv').config({ path: __dirname + '/.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = Router();

const getDataProduct = async (arrayProduct) => {
    //Le quite el 19
    if (Array.isArray(arrayProduct)) {
        const price = [];
        const product = [];

        for (let i = 0; i < arrayProduct.length; i++) {
            const product_element = await stripe.products.retrieve(arrayProduct[i]);
            const price_element = await stripe.prices.retrieve(product_element.default_price);
            price.push(price_element.unit_amount);
            product.push(product_element);
        }

        return { product, price };
    }

    const product = await stripe.products.retrieve(arrayProduct);
    const price_obj = await stripe.prices.retrieve(product.default_price);
    const price = price_obj.unit_amount;
    return { product, price };
}


router.get('/', (req, res) => {
    res.render('index', {
        title: 'Tienda Online!'
    });
});

router.get('/shoppingCart', (req, res) => res.render('cart', { title: 'Carrito de compras!' }));

router.get('/confirm-payment/?', async (req, res) => {
    const id = req.query.payment_intent;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        if (paymentIntent.status === 'succeeded') {
            const idProducts = Object.values(paymentIntent.metadata);
            if (idProducts.length > 2) {
                //Code
            } else {
                const { product, price } = await getDataProduct(idProducts[0]);
                res.render('success_payment', { title: 'Payment Success', product, total: price });
            }
        }
    } catch (error) {
        res.send(error);
    }
});

router.get('/logUp', (req, res) => {
    res.render('logUp', { title: 'LogUp' });
});

router.get('/login', async (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/getSession', (req, res) => {
    if (!req.session.name) res.send({ error: 'Session not found' });
    else res.send({ name: req.session.name });
});

router.get('/history', (req, res) => {
    if (req.session.id) {
        res.render('history', { title: 'Historial de compras' });
    } else {
        res.send({ error: 'Session not found' });
    }
});

router.get('/getHistoryPaymentsCursomer', async (req, res) => {
    try {
        const paymentIntents = await stripe.paymentIntents.list({
            customer: req.session.userID,
        });
        const paymentIntentSuccess = paymentIntents.data.filter(paymentIntent => paymentIntent.status === 'succeeded');

        res.send({ paymentIntentSuccess });
    } catch (error) {
        res.send({ error: error }).status();
    }
});

router.get('/:product', async (req, res) => {
    try {
        const id = req.params.product;
        if (id !== '...') {
            const { product, price } = await getDataProduct(id);
            res.render('product', { title: product.name, price: price, product, Pk: process.env.STRIPE_PUBLISHABLE_KEY });
        } else if (id === undefined) {
            res.send(404);
        } else {
            res.sendStatus(200);
        }
    } catch (error) {
        res.send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const products = await stripe.products.list({ active: true });
        const prices = await stripe.prices.list({ active: true });
        if (products && prices) {
            res.send({ products: products, price: prices });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/registerUser', async (req, res) => {
    const { address, userData } = req.body;
    try {
        const customer = await stripe.customers.create({
            address: {
                city: address.city,
                country: address.country,
                postal_code: address.postalCode,
                state: address.state
            },
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            metadata: {
                password: userData.password
            }
        });
        if (!customer) throw new Error();

        req.session.name = userData.name;
        req.session.userID = customer.id;

        res.send({ customer });
    } catch (error) {
        res.send(error).status(400);
    }
});

router.post('/getUser', async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await stripe.customers.list({
            email: email,
            limit: 1
        });
        if (customer.data[0].metadata.password === password) {

            req.session.name = customer.data[0].name;
            req.session.userID = customer.data[0].id;

            res.send({ customer });
        } else {
            throw new Error();
        }
    } catch (error) {
        res.send(error);
    }
});

router.post("/create-payment-intent", async (req, res) => {
    const id_product = req.body.length > 1 ? req.body.map((product) => product.idProduct) : req.body[0].idProduct;
    const amount_product = req.body.map((product) => product.amount);
    const { product, price } = await getDataProduct(id_product);

    // Create a PaymentIntent with the order amount and currency
    let metadata = new Object();
    if (Array.isArray(product)) product.forEach((product, i) => {
        metadata[product.name] = product.id;
        metadata[product.id] = req.body[i].amount;
    });
    else metadata[product.name] = product.id;

    if (req.session.userID) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(price, amount_product),
            currency: "mxn",
            payment_method_types: ['card', 'oxxo'],
            description: Array.isArray(product) ? 'compra de varios productos' : product.name,
            metadata,
            customer: req.session.userID
        });

        if (paymentIntent) {
            res.send({
                clientSecret: paymentIntent.client_secret
            });
        } else res.send({
            error: 'error'
        });
    } else {
        res.send({
            error: 'user not logged in'
        });
    }
});

router.post('/getProduct', async (req, res) => {
    try {
        const { idProduct } = req.body;
        const { product } = await getDataProduct(idProduct);
        res.send({ product });
    } catch (error) {
        res.send({ error: error }).status(404);
    }
});

module.exports = router;