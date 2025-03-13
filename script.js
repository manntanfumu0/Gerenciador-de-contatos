document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    if (name && email && phone) {
        const contactList = document.getElementById('contact-list');
        const li = document.createElement('li');
        li.innerHTML = `<span>${name} - ${email} - ${phone}</span> <button onclick="this.parentElement.remove()">✖</button>`;
        contactList.appendChild(li);
        this.reset();
    } else {
        alert('Preencha todos os campos!');
    }
});
