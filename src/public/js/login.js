const form = document.getElementById('form');

document.querySelector('.btn').addEventListener('click', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const user = {
        email: data.get('email'),
        password: data.get('password')
    }
    console.log(user);
    try {
        const req = await fetch('/getUser', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        const {customer} = await req.json();
        if (!customer) alert('No existe el usuario');
        else location.href = '/';
    } catch (error) {
        console.log(error);
    }
})