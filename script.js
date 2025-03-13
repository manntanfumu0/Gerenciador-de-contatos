const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');

// Função para salvar os contatos no localStorage
function saveContacts(contacts) {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Função para carregar os contatos do localStorage
function loadContacts() {
    return JSON.parse(localStorage.getItem('contacts')) || [];
}

// Função para adicionar um novo contato
function addContact(event) {
    event.preventDefault(); // Evitar o envio do formulário

    // Obtendo os dados do formulário
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (name && email && phone) {
        // Criando o item de contato
        const newContact = { name, email, phone };

        // Carregando os contatos atuais do localStorage
        const contacts = loadContacts();

        // Adicionando o novo contato à lista
        contacts.push(newContact);

        // Salvando a lista de contatos atualizada
        saveContacts(contacts);

        // Atualizando a lista de contatos na interface
        renderContactList(contacts);

        // Limpando os campos do formulário
        contactForm.reset();
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

// Função para remover um contato
function removeContact(event) {
    // Obtendo o nome do contato a partir do botão clicado
    const li = event.target.closest('li');
    const name = li.querySelector('span').textContent.split('\n')[0]; // Pegando o nome

    // Carregar os contatos do localStorage
    const contacts = loadContacts();

    // Filtrar os contatos removendo o contato com o nome correspondente
    const updatedContacts = contacts.filter(contact => contact.name !== name);

    // Atualizando o localStorage com a lista de contatos sem o removido
    saveContacts(updatedContacts);

    // Atualizando a lista de contatos na interface
    renderContactList(updatedContacts);
}

// Função para renderizar a lista de contatos
function renderContactList(contacts) {
    // Limpar a lista de contatos atual na interface
    contactList.innerHTML = '';

    // Renderizar cada contato na lista
    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${contact.name}</strong><br>${contact.email}<br>${contact.phone}</span>
            <button onclick="removeContact(event)">Remover</button>
        `;
        contactList.appendChild(li);
    });
}

// Adicionando o evento de envio do formulário
if (contactForm) {
    contactForm.addEventListener('submit', addContact);
}

// Carregar e renderizar os contatos ao iniciar a página
if (document.getElementById('contact-list')) {
    const contacts = loadContacts();
    renderContactList(contacts);
}

// Evento para o botão "Ver Todos os Contatos" na página principal
const viewAllButton = document.getElementById('view-all-button');
if (viewAllButton) {
    viewAllButton.addEventListener('click', () => {
        window.location.href = 'contatos.html';
    });
}
