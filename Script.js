document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const contactsList = document.getElementById('contact-list');
    const searchInput = document.getElementById('search-input');

    let allContacts = [];

    // Envia novo contato
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            const response = await fetch('http://localhost:3000/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            });

            alert(await response.text());
            window.location.href = 'contatos.html';
        });
    }

    // Busca e exibe todos os contatos
    if (contactsList) {
        fetch('http://localhost:3000/contacts')
            .then(res => res.json())
            .then(data => {
                allContacts = data;
                renderContacts(allContacts);
            });

        // Filtro em tempo real
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                const filteredContacts = allContacts.filter(contact =>
                    contact.name.toLowerCase().includes(searchTerm) ||
                    contact.email.toLowerCase().includes(searchTerm)
                );
                renderContacts(filteredContacts);
            });
        }
    }

    // Renderiza lista de contatos
    function renderContacts(contacts) {
        contactsList.innerHTML = '';
        if (contacts.length === 0) {
            contactsList.innerHTML = '<li>Nenhum contato encontrado.</li>';
            return;
        }

        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="contact-info">
                    <p><strong>Nome:</strong> ${contact.name}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Telefone:</strong> ${contact.phone}</p>
                </div>
                <button onclick="deleteContact(${contact.id})">Remover</button>
            `;
            contactsList.appendChild(li);
        });
        
    }

    // Remove contato
    window.deleteContact = function(id) {
        fetch(`http://localhost:3000/delete/${id}`, { method: 'DELETE' })
            .then(response => response.text())
            .then(result => {
                alert(result);
                window.location.reload();
            });
    }
});

const viewAllButton = document.getElementById('view-all-button');

if (viewAllButton) {
    viewAllButton.addEventListener('click', () => {
        window.location.href = 'contatos.html';
    });
}

