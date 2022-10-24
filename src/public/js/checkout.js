const stripe = Stripe("pk_test_51KKs0mB3o2YvX3htVXYBDnHaseEHwDzCJxx94G1ZhNzTsp4wM3Vd7jxnrC0Fy6CtUeaqLCedXUtFxb1T6HYyVozz00FwTQHZuH");
const productId = document.querySelector('.buy');

const item = [{ idProduct: productId.dataset.id }];
let elements;

addEventListener('DOMContentLoaded', () => {
    initialize();
})

productId.addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: `http://localhost:3000/confirm-payment/`,
        },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
        console.log(error.message);
    } else {
        console.log("An unexpected error occurred.");
    }
});

async function initialize() {
    const response = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });
    const { clientSecret, error } = await response.json();

    const appearance = {
        theme: 'flat'
    };

    if (error) {
        alert('Inicia session para realizar compra');
        document.querySelector('#payment-element').textContent = 'Inicia session';
        return;
    } else {
        elements = stripe.elements({ appearance, clientSecret });

        const paymentElement = elements.create("payment");
        paymentElement.mount("#payment-element");
    }
}

async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
    );

    if (!clientSecret) {
        console.log('No hay');
        return
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
        case "succeeded":
            console.log("Payment succeeded!");
            break;
        case "processing":
            console.log("Your payment is processing.");
            break;
        case "requires_payment_method":
            console.log("Your payment was not successful, please try again.");
            break;
        default:
            console.log("Something went wrong.");
            break;
    }
}
