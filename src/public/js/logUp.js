const fromAddress = document.querySelector('.template-FromAddress').content;
const fromConfirm = document.querySelector('.template-confirmUser').content;
document.querySelector('.containerFrom').appendChild(fromAddress);

document.querySelector('.next-Address').addEventListener('click', (e) => {
    e.preventDefault();
    const fromData = document.getElementById('from-address');
    const DataAddress = new FormData(fromData);
    document.querySelector('.containerFrom').replaceChildren(fromConfirm);
    document.querySelector('#staticEmail2').setAttribute('value', DataAddress.get('email'));
    confirmUser(DataAddress);
});

const confirmUser = (user) => {
    document.querySelector('.confirm').addEventListener('click', async (e) => { 
        e.preventDefault();
        const fromData = document.getElementById('from-user');
        const dataUser = new FormData(fromData);

        const address = {
            city: user.get('city'),
            country: 'Mexico',
            postalCode: user.get('zip'),
            state: user.get('state'),
        }

        const userData = {
            name: user.get('name') + ' ' + user.get('lastName'),
            email: user.get('email'),
            phone: dataUser.get('phone'),
            password: dataUser.get('password'),
        }

        const customerData = { address, userData}

        const req = await fetch('/registerUser', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData)
        });

        const {customer} = await req.json();
        if(!customer) console.log('error al crear');
        else location.href = '/';        
    });
}

