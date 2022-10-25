const stripe = Stripe("pk_test_51KKs0mB3o2YvX3htVXYBDnHaseEHwDzCJxx94G1ZhNzTsp4wM3Vd7jxnrC0Fy6CtUeaqLCedXUtFxb1T6HYyVozz00FwTQHZuH");
const templateProduct = document.querySelector('.templateProduct').content;
const fragment = new DocumentFragment();
let count = 0;
let elements;

(async () => {
    const dataLocal = JSON.parse(localStorage.getItem('cart'));
    Object.values(dataLocal).forEach(key => {

        templateProduct.querySelector('.btn-danger').dataset.id = key.idProduct;
        templateProduct.querySelector('.btn-danger').dataset.price = key.price;
        templateProduct.querySelector('.btn-success').dataset.id = key.idProduct;
        templateProduct.querySelector('.btn-success').dataset.price = key.price;

        templateProduct.querySelector('.images').setAttribute('src', key.img);
        templateProduct.querySelector('.name').textContent = key.name;
        templateProduct.querySelector('.input_amount').setAttribute('value', key.amount);
        templateProduct.querySelector('.input_amount').setAttribute('id', key.idProduct);

        templateProduct.querySelector('.total').textContent = (key.price * key.amount)/100;
        templateProduct.querySelector('.total').className = `total ${key.idProduct}`;
        count += parseInt(key.price * key.amount)/100;
        const clone = templateProduct.cloneNode(true);
        fragment.appendChild(clone);
    });

    document.querySelector('.containerData_cart').appendChild(fragment);
    document.querySelector('.total_product').textContent = count;
})();


document.querySelector('.buy_now').addEventListener('click', (e) => {
    e.preventDefault();
    (async () => {
        const dataLocal = JSON.parse(localStorage.getItem('cart'));
        const req = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.values(dataLocal))
        });

        const { clientSecret } = await req.json();

        const appearance = {
            theme: 'flat'
        };

        elements = stripe.elements({ appearance, clientSecret });

        const paymentElement = elements.create("payment");
        paymentElement.mount("#payment-element");

    })();
});

document.querySelector('.containerData_cart').addEventListener('click', e => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('cart'));
    if(e.target.classList.contains('btn-danger')) {
        data[e.target.dataset.id].amount > 1 ? data[e.target.dataset.id].amount-- : console.log('Desea eliminar el producto?');
        count -= parseInt(e.target.dataset.price)/100;
    }else if(e.target.classList.contains('btn-success')){
        data[e.target.dataset.id].amount++;
        count += parseInt(e.target.dataset.price)/100;
    }

    document.querySelector('#' + e.target.dataset.id).setAttribute('value', data[e.target.dataset.id].amount);
    document.querySelector('.' + e.target.dataset.id).textContent = (data[e.target.dataset.id].amount * e.target.dataset.price)/100;
    document.querySelector('.total_product').textContent = count;
    localStorage.setItem('cart', JSON.stringify(data));

    e.stopPropagation();
});


document.querySelector('.btn-but-success').addEventListener('click', async (e) => {
    console.log('click');
    e.preventDefault();
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: `https://tiendaonlinespg.herokuapp.com/confirm-payment`,
        },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
        console.log(error.message);
    } else {
        console.log("An unexpected error occurred.");
    }
});