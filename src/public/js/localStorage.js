addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('.Cantidad').textContent = Object.values(JSON.parse(localStorage.getItem('cart'))).length;
});


document.querySelector('.containerCart').addEventListener('click', (e)=>{
    e.stopPropagation();
    window.location.href = '/shoppingCart';
});