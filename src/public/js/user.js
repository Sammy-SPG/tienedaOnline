(async () => {
    const req = await fetch('/getSession', {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    });
    const { name } = await req.json();
    if (typeof name === 'undefined') {
        document.querySelector('.disabled').textContent = 'Inicia sesion';
        document.querySelector('.user').addEventListener('click', (e) => {
            e.preventDefault();
            location.href = '/logUp';
        });
    }else{
        document.querySelector('.user').addEventListener('click', (e) => {
            e.preventDefault();
            location.href = '/history';
        });
        document.querySelector('.disabled').textContent = name;
    }
})()