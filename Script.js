document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form")
  const contactsList = document.getElementById("contact-list")
  const searchInput = document.getElementById("search-input")
  const editForm = document.getElementById("edit-form")
  const editModal = document.getElementById("edit-modal")

  let allContacts = []
  let currentContactId = null

  // Envia novo contato
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault()
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value

      try {
        const response = await fetch("http://localhost:3000/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        })

        const message = await response.text()

        if (!response.ok) {
          alert(message)
          return
        }

        alert(message)
        window.location.href = "contatos.html"
      } catch (error) {
        alert("Erro ao conectar com o servidor: " + error.message)
      }
    })
  }

  // Busca e exibe todos os contatos
  if (contactsList) {
    fetch("http://localhost:3000/contacts")
      .then((res) => res.json())
      .then((data) => {
        allContacts = data
        renderContacts(allContacts)
      })
      .catch((error) => {
        console.error("Erro ao buscar contatos:", error)
        contactsList.innerHTML = "<li>Erro ao carregar contatos. Tente novamente mais tarde.</li>"
      })

    // Filtro em tempo real
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase().trim()
        const filteredContacts = allContacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchTerm) ||
            contact.email.toLowerCase().includes(searchTerm) ||
            contact.phone.includes(searchTerm),
        )
        renderContacts(filteredContacts)
      })
    }
  }

  // Formulário de edição
  if (editForm) {
    editForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      if (!currentContactId) return

      const name = document.getElementById("edit-name").value
      const email = document.getElementById("edit-email").value
      const phone = document.getElementById("edit-phone").value

      try {
        const response = await fetch(`http://localhost:3000/update/${currentContactId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        })

        const message = await response.text()

        if (!response.ok) {
          alert(message)
          return
        }

        alert(message)
        closeEditModal()
        window.location.reload()
      } catch (error) {
        alert("Erro ao conectar com o servidor: " + error.message)
      }
    })
  }

  // Renderiza lista de contatos
  function renderContacts(contacts) {
    contactsList.innerHTML = ""

    if (!contacts || contacts.length === 0) {
      contactsList.innerHTML = "<li>Nenhum contato encontrado.</li>"
      return
    }

    // Ordena os contatos por nome, ignorando maiúsculas e acentos
    contacts.sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }))

    contacts.forEach((contact) => {
      const li = document.createElement("li")
      li.innerHTML = `
              <div class="contact-info">
                  <p><strong>Nome:</strong> ${contact.name}</p>
                  <p><strong>Email:</strong> ${contact.email}</p>
                  <p><strong>Telefone:</strong> ${contact.phone}</p>
              </div>
              <div class="contact-actions">
                  <button onclick="editContact(${contact.id})" class="edit-btn">Editar</button>
                  <button onclick="deleteContact(${contact.id})" class="delete-btn">Remover</button>
              </div>
          `
      contactsList.appendChild(li)
    })
  }

  // Remove contato
  window.deleteContact = (id) => {
    if (confirm("Tem certeza que deseja remover este contato?")) {
      fetch(`http://localhost:3000/delete/${id}`, { method: "DELETE" })
        .then((response) => response.text())
        .then((result) => {
          alert(result)
          window.location.reload()
        })
        .catch((error) => {
          alert("Erro ao remover contato: " + error.message)
        })
    }
  }

  // Editar contato - abre o modal e preenche com os dados do contato
  window.editContact = (id) => {
    currentContactId = id

    fetch(`http://localhost:3000/contact/${id}`)
      .then((res) => res.json())
      .then((contact) => {
        document.getElementById("edit-name").value = contact.name
        document.getElementById("edit-email").value = contact.email
        document.getElementById("edit-phone").value = contact.phone

        openEditModal()
      })
      .catch((error) => {
        alert("Erro ao buscar dados do contato: " + error.message)
      })
  }

  // Abrir modal de edição
  function openEditModal() {
    if (editModal) {
      editModal.style.display = "flex"
    }
  }

  // Fechar modal de edição
  function closeEditModal() {
    if (editModal) {
      editModal.style.display = "none"
      currentContactId = null
    }
  }

  window.closeEditModal = closeEditModal

  // Fechar modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (editModal && event.target === editModal) {
      closeEditModal()
    }
  })

  const viewAllButton = document.getElementById("view-all-button")

  if (viewAllButton) {
    viewAllButton.addEventListener("click", () => {
      window.location.href = "contatos.html"
    })
  }
})
