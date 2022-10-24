const cart = {};

const bt_add = document.querySelector('.btn-primary').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newData = {
        idProduct: e.target.dataset.id,
        name: document.querySelector('.card-title').textContent,
        img: document.querySelector('.img-fluid').getAttribute('src'),
        price: document.querySelector('.price_product').textContent,
        amount: 1
    }
    cart[newData.idProduct] = { ...newData };
    setCart(newData);
});

const setCart = (cart_data) => {
    if (localStorage.getItem('cart')) {
        const aux = JSON.parse(localStorage.getItem('cart'));
        if (aux.hasOwnProperty(cart_data.idProduct)) {
            Swal.fire({
                title: 'Ya tienes un este producto en el carrito, Desea aumentar la cantidad?',
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`,
            }).then((result) => {
                if (result.isConfirmed) {
                    aux[cart_data.idProduct].amount++;
                    localStorage.setItem('cart', JSON.stringify(aux));
                    Swal.fire('Se guardo con exito', '', 'success')
                } else if (result.isDenied) {
                    Swal.fire('No se guardo', '', 'info')
                }
            })
        } else {
            aux[cart_data.idProduct] = { ...cart_data }
            Swal.fire({
                icon: 'success',
                title: 'Se guardo con exito',
                showConfirmButton: false,
                timer: 1000
            });
            localStorage.setItem('cart', JSON.stringify(aux));
        }
    } else localStorage.setItem('cart', JSON.stringify(cart));

    document.querySelector('.Cantidad').textContent = Object.values(JSON.parse(localStorage.getItem('cart'))).length;
}





