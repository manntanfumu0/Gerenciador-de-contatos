document.addEventListener("DOMContentLoaded", () => {
  // Gerenciamento de tema
  const themeToggle = document.getElementById("theme-toggle")

  // Verificar se há preferência salva
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode")
    updateThemeIcon()
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode")

      // Salvar preferência
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark")
      } else {
        localStorage.setItem("theme", "light")
      }

      updateThemeIcon()
    })
  }

  const phoneInput = document.getElementById("phone");
if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, ""); // remove tudo que não for número
  });
}


  function updateThemeIcon() {
    const isDark = document.body.classList.contains("dark-mode")
    if (themeToggle) {
      if (isDark) {
        themeToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `
      } else {
        themeToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `
      }
    }
  }

  // Variáveis para filtros e ordenação
  let currentFilter = "all"
  let currentSort = "name"
  let allContacts = []

  const contactForm = document.getElementById("contact-form")
  const contactsList = document.getElementById("contact-list")
  const searchInput = document.getElementById("search-input")
  const editForm = document.getElementById("edit-form")
  const editModal = document.getElementById("edit-modal")
  const searchButton = document.getElementById("search-button")

  let currentContactId = null

  // Função para mostrar notificações
  function showNotification(message, type) {
    // Verifica se já existe uma notificação e remove
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    // Cria elemento de notificação
    const notification = document.createElement("div")
    notification.className = `notification ${type}`

    // Ícone baseado no tipo
    let icon = ""
    if (type === "success") {
      icon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `
    } else {
      icon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `
    }

    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-message">${message}</div>
      <button class="notification-close">×</button>
    `

    // Adiciona ao body
    document.body.appendChild(notification)

    // Adiciona evento para fechar
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      notification.remove()
    })

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.add("notification-hide")
        setTimeout(() => notification.remove(), 300)
      }
    }, 5000)

    // Mostra com animação
    setTimeout(() => {
      notification.classList.add("notification-show")
    }, 10)
  }

  // Adiciona estilos para notificações se ainda não existirem
  if (!document.querySelector("style[data-notification-styles]")) {
    const notificationStyles = document.createElement("style")
    notificationStyles.setAttribute("data-notification-styles", "true")
    notificationStyles.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        max-width: 350px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 9999;
      }
      
      .notification-show {
        transform: translateX(0);
      }
      
      .notification-hide {
        transform: translateX(120%);
      }
      
      .notification.success {
        background-color: #4caf50;
        color: white;
      }
      
      .notification.error {
        background-color: #f44336;
        color: white;
      }
      
      .notification-icon {
        margin-right: 12px;
      }
      
      .notification-message {
        flex: 1;
        font-size: 14px;
      }
      
      .notification-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        line-height: 1;
      }
    `
    document.head.appendChild(notificationStyles)
  }

  // Modal
  function openEditModal() {
    if (editModal) {
      editModal.style.display = "flex"
      document.body.style.overflow = "hidden" // Impede rolagem do body
    }
  }

  function closeEditModal() {
    if (editModal) {
      editModal.style.display = "none"
      document.body.style.overflow = "" // Restaura rolagem do body
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

  // Renderiza lista de contatos
  function renderContacts(contacts) {
    if (!contactsList) return

    contactsList.innerHTML = ""

    if (!contacts || contacts.length === 0) {
      contactsList.innerHTML = `
        <li class="empty-list">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
            <path d="M8 14h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 18h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M16 18h.01"></path>
          </svg>
          <p>Nenhum contato encontrado.</p>
        </li>
      `
      return
    }

    // Aplicar filtro atual
    let filteredContacts = contacts
    if (currentFilter !== "all") {
      if (currentFilter === "favorite") {
        filteredContacts = contacts.filter((contact) => contact.favorite)
      } else {
        filteredContacts = contacts.filter((contact) => contact.category === currentFilter)
      }
    }

    // Aplicar ordenação atual
    if (currentSort === "name") {
      filteredContacts.sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }))
    } else if (currentSort === "recent") {
      filteredContacts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    }

    // Atualizar estatísticas
    updateStats(contacts)

    filteredContacts.forEach((contact) => {
      const li = document.createElement("li")

      // Determinar a classe da categoria
      const categoryClass = contact.category || "other"
      const categoryLabel = getCategoryLabel(contact.category)

      li.innerHTML = `
        <div class="contact-info">
          <div class="contact-header">
            <div class="contact-name-container">
              <strong>${contact.name}</strong>
              <span class="contact-category category-${categoryClass}">${categoryLabel}</span>
            </div>
            <button class="favorite-btn ${contact.favorite ? "active" : ""}" onclick="toggleFavorite(${contact.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${contact.favorite ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          </div>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Telefone:</strong> ${contact.phone}</p>
        </div>
        <div class="contact-actions">
          <button onclick="editContact(${contact.id})" class="edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar
          </button>
          <button onclick="deleteContact(${contact.id})" class="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Remover
          </button>
        </div>
      `
      contactsList.appendChild(li)
    })
  }

  // Função para obter o rótulo da categoria
  function getCategoryLabel(category) {
    switch (category) {
      case "work":
        return "Trabalho"
      case "family":
        return "Família"
      case "friends":
        return "Amigos"
      case "other":
        return "Outros"
      default:
        return "Outros"
    }
  }

  // Função para atualizar estatísticas
  function updateStats(contacts) {
    const totalElement = document.getElementById("total-contacts")
    const favoriteElement = document.getElementById("favorite-contacts")
    const workElement = document.getElementById("work-contacts")
    const familyElement = document.getElementById("family-contacts")

    if (totalElement) totalElement.textContent = contacts.length

    if (favoriteElement) {
      const favoriteCount = contacts.filter((c) => c.favorite).length
      favoriteElement.textContent = favoriteCount
    }

    if (workElement) {
      const workCount = contacts.filter((c) => c.category === "work").length
      workElement.textContent = workCount
    }

    if (familyElement) {
      const familyCount = contacts.filter((c) => c.category === "family").length
      familyElement.textContent = familyCount
    }
  }

  // Função para alternar favorito
  window.toggleFavorite = (id) => {
    fetch(`http://localhost:3000/contact/${id}`)
      .then((res) => res.json())
      .then((contact) => {
        // Inverter o status de favorito
        const updatedContact = {
          ...contact,
          favorite: !contact.favorite,
        }

        return fetch(`http://localhost:3000/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedContact),
        })
      })
      .then((response) => {
        if (response.ok) {
          // Recarregar contatos
          fetch("http://localhost:3000/contacts")
            .then((res) => res.json())
            .then((data) => {
              allContacts = data
              renderContacts(allContacts)
            })
        }
      })
      .catch((error) => {
        showNotification("Erro ao atualizar favorito: " + error.message, "error")
      })
  }

  // Função para exportar contatos
  function exportContacts(contacts) {
    // Criar CSV
    let csv = "Nome,Email,Telefone,Categoria,Favorito\n"

    contacts.forEach((contact) => {
      const favorite = contact.favorite ? "Sim" : "Não"
      const category = getCategoryLabel(contact.category)
      csv += `"${contact.name}","${contact.email}","${contact.phone}","${category}","${favorite}"\n`
    })

    // Criar blob e link para download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "contatos_cruzeiro_tech.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification("Contatos exportados com sucesso!", "success")
  }

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.toLowerCase().trim()
      if (!searchTerm) {
        renderContacts(allContacts)
        return
      }

      const filteredContacts = allContacts.filter((contact) => {
        return (
          contact.name.toLowerCase().includes(searchTerm) ||
          contact.email.toLowerCase().includes(searchTerm) ||
          contact.phone.toLowerCase().includes(searchTerm)
        )
      })
      renderContacts(filteredContacts)
    })

    // Adicionar busca ao pressionar Enter
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchButton.click()
      }
    })
  }

  // Configurar filtros de categoria
  const filterButtons = document.querySelectorAll(".filter-btn")
  if (filterButtons.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remover classe ativa de todos os botões
        filterButtons.forEach((b) => b.classList.remove("active"))

        // Adicionar classe ativa ao botão clicado
        btn.classList.add("active")

        // Atualizar filtro atual
        currentFilter = btn.dataset.filter

        // Renderizar contatos com novo filtro
        renderContacts(allContacts)
      })
    })
  }

  // Configurar opções de ordenação
  const sortButtons = document.querySelectorAll(".sort-btn")
  if (sortButtons.length > 0) {
    sortButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remover classe ativa de todos os botões
        sortButtons.forEach((b) => b.classList.remove("active"))

        // Adicionar classe ativa ao botão clicado
        btn.classList.add("active")

        // Atualizar ordenação atual
        currentSort = btn.dataset.sort

        // Renderizar contatos com nova ordenação
        renderContacts(allContacts)
      })
    })
  }

  // Configurar botão de exportação
  const exportBtn = document.getElementById("export-btn")
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportContacts(allContacts)
    })
  }

  // Botão para visualizar contatos na página inicial
  const viewAllButton = document.getElementById("view-all-button")
  if (viewAllButton) {
    viewAllButton.addEventListener("click", () => {
      window.location.href = "contatos.html"
    })
  }

  // Carregar contatos se estiver na página de contatos
  if (contactsList) {
    // Mostrar indicador de carregamento
    contactsList.innerHTML = `
      <li class="loading-indicator">
        <div class="spinner"></div>
        <p>Carregando contatos...</p>
      </li>
    `

    fetch("http://localhost:3000/contacts")
      .then((res) => res.json())
      .then((data) => {
        allContacts = data
        renderContacts(allContacts)
      })
      .catch((error) => {
        console.error("Erro ao buscar contatos:", error)
        contactsList.innerHTML = `
          <li class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>Erro ao carregar contatos. Tente novamente mais tarde.</p>
          </li>
        `
      })
  }

  // Remover contato
  window.deleteContact = (id) => {
    if (confirm("Tem certeza que deseja remover este contato?")) {
      fetch(`http://localhost:3000/delete/${id}`, { method: "DELETE" })
        .then((response) => response.text())
        .then((result) => {
          showNotification(result, "success")
          // Atualizar a lista de contatos após remover
          allContacts = allContacts.filter((contact) => contact.id !== Number.parseInt(id))
          renderContacts(allContacts)
        })
        .catch((error) => {
          showNotification("Erro ao remover contato: " + error.message, "error")
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

        // Preencher novos campos
        if (document.getElementById("edit-category")) {
          document.getElementById("edit-category").value = contact.category || "other"
        }

        if (document.getElementById("edit-favorite")) {
          document.getElementById("edit-favorite").checked = contact.favorite || false
        }

        openEditModal()
      })
      .catch((error) => {
        showNotification("Erro ao buscar dados do contato: " + error.message, "error")
      })
  }

  // Formulário de edição
  if (editForm) {
    editForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      if (!currentContactId) return

      const saveButton = editForm.querySelector(".save-button")
      const originalText = saveButton.textContent
      saveButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"></path>
        </svg>
        Salvando...
      `
      saveButton.disabled = true

      const name = document.getElementById("edit-name").value
      const email = document.getElementById("edit-email").value
      const phone = document.getElementById("edit-phone").value

      // Obter valores dos novos campos
      const category = document.getElementById("edit-category")?.value || "other"
      const favorite = document.getElementById("edit-favorite")?.checked || false

      try {
        const response = await fetch(`http://localhost:3000/update/${currentContactId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, category, favorite }),
        })

        const message = await response.text()

        if (!response.ok) {
          showNotification(message, "error")
          return
        }

        showNotification(message, "success")
        closeEditModal()

        // Atualizar a lista de contatos após editar
        fetch("http://localhost:3000/contacts")
          .then((res) => res.json())
          .then((data) => {
            allContacts = data
            renderContacts(allContacts)
          })
      } catch (error) {
        showNotification("Erro ao conectar com o servidor: " + error.message, "error")
      } finally {
        saveButton.textContent = originalText
        saveButton.disabled = false
      }
    })
  }

  // Envia novo contato
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      const submitButton = contactForm.querySelector('button[type="submit"]')
      const originalText = submitButton.innerHTML
      submitButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"></path>
        </svg>
        Cadastrando...
      `
      submitButton.disabled = true

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value

      // Obter valores dos novos campos
      const category = document.getElementById("category")?.value || "other"
      const favorite = document.getElementById("favorite")?.checked || false
      const timestamp = Date.now()

      try {
        const response = await fetch("http://localhost:3000/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, category, favorite, timestamp }),
        })

        const message = await response.text()

        if (!response.ok) {
          showNotification(message, "error")
          return
        }

        showNotification(message, "success")
        setTimeout(() => {
          window.location.href = "contatos.html"
        }, 1500)
      } catch (error) {
        showNotification("Erro ao conectar com o servidor: " + error.message, "error")
      } finally {
        submitButton.innerHTML = originalText
        submitButton.disabled = false
      }
    })
  }
})
