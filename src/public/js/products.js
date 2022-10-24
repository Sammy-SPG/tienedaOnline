const templateProduct = document.querySelector('.templateProduct').content;
const container_gridProduct = document.querySelector('.container_gridProduct');
const documentFragment = new DocumentFragment();

addEventListener('DOMContentLoaded', () => {
    const arrayData = [];
    (async () => {
        try {
            const req = await fetch('/', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'POST'
            });
            const res = await req.json();
            Object.values(res).forEach(item => {
                arrayData.push(item.data);
            });
            getProducts(arrayData);
        } catch (error) {
            console.log(error);
        }
    })();
});

const getProducts = (arrayData) => {
    const products = arrayData[0];
    const prices = arrayData[1];
    const product_prices = products.map((product, i) => {
        return { id: product.id, name: product.name, arrayImages: product.images, currency: prices[i].currency, amount: prices[i].unit_amount }
    });
    printProduct(product_prices);
}

const printProduct = (arrProduct) => {
    arrProduct.forEach((product) => {
        templateProduct.querySelector('.card-img-top').setAttribute('src', product.arrayImages[0]);
        templateProduct.querySelector('.card-name').textContent = product.name;
        templateProduct.querySelector('.currency').textContent = product.currency;
        templateProduct.querySelector('.amount').textContent = product.amount.toString().slice(0, 3) + ".00";
        templateProduct.querySelector('.btn-success').dataset.id = product.id;

        const Elementproduct = templateProduct.cloneNode(true);
        documentFragment.appendChild(Elementproduct);
    });

    container_gridProduct.appendChild(documentFragment);
}

container_gridProduct.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.className.indexOf('btn-success') > -1) window.location.href = '/' + e.target.dataset.id;
    else return;
});