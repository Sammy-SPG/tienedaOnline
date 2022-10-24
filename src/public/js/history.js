const templateCard = document.querySelector('.template-card').content;
const container = document.querySelector('.container');
const fragment = new DocumentFragment();

addEventListener('DOMContentLoaded', () => {
    (async () => {
        const req = await fetch('/getHistoryPaymentsCursomer');
        const { paymentIntentSuccess, error } = await req.json();
        if (error) {
            console.log(error);
            return
        }
        pintarCard(paymentIntentSuccess);
    })();
});

const pintarCard = async (paymentIntentSuccess) => {
    let id = '';
    for (let i = 0; i < paymentIntentSuccess.length; i++) {
        for (let j = 0; j < Object.values(paymentIntentSuccess[i].metadata).length; j++) {
            if (Object.values(paymentIntentSuccess[i].metadata)[j].length > 2) {
                id = Object.values(paymentIntentSuccess[i].metadata)[j];
                
                const req = await fetch('/getProduct', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idProduct: id })
                });

                const { product } = await req.json();
                templateCard.querySelector('.img-fluid ').setAttribute('src', product.images[0]);
                templateCard.querySelector('.card-title').textContent = product.name;
                templateCard.querySelector('.card-text').textContent = product.description;

                const clone = templateCard.cloneNode(true);
                fragment.appendChild(clone);
            } else continue;
        }
    }

    container.appendChild(fragment);

}

