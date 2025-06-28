/*
Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Data: 28/06/2025

Programação Web Front-End - Projeto 2
*/

document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const userNameInput = document.getElementById('nome');
    const userEmailInput = document.getElementById('email');
    const userList = document.getElementById('user-list');
    const searchInput = document.getElementById('search');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    const STORAGE_KEY = 'usersData';

    // Carrega os usuários do Local Storage ao iniciar a página
    loadUsers();

    // Adiciona um novo usuário
    userForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const userName = userNameInput.value.trim();
        const userEmail = userEmailInput.value.trim();

        if (userName && userEmail) {
            const user = {
                id: Date.now(), // ID único baseado no timestamp
                name: userName,
                email: userEmail,
                createdAt: new Date().toLocaleDateString('pt-BR')
            };
            addUser(user);
            userForm.reset(); // Limpa os campos do formulário
        }
    });

    // Limpa os campos do formulário
    clearFormBtn.addEventListener('click', () => {
        userForm.reset();
    });

    // Exclui todos os usuários
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir TODOS os usuários? Esta ação não pode ser desfeita.')) {
            clearAllUsers();
        }
    });
    
    // Filtra usuários conforme o usuário digita
    searchInput.addEventListener('keyup', searchUsers);

    // Função para obter usuários do Local Storage
    function getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    // Função para salvar usuários no Local Storage
    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    // Função para renderizar a lista de usuários na tela
    function renderUsers(users) {
        userList.innerHTML = ''; // Limpa a lista antes de renderizar
        if (users.length === 0) {
            userList.innerHTML = '<li>Nenhum usuário cadastrado.</li>';
            return;
        }
        users.forEach(user => {
            const li = document.createElement('li');
            li.setAttribute('data-id', user.id);
            li.innerHTML = `
                <span><strong>Nome:</strong> ${user.name} | <strong>E-mail:</strong> ${user.email} | <strong>Data:</strong> ${user.createdAt}</span>
                <button class="delete-btn">Excluir</button>
            `;
            userList.appendChild(li);

            // Adiciona evento ao botão de excluir
            li.querySelector('.delete-btn').addEventListener('click', () => {
                deleteUser(user.id);
            });
        });
    }

    // (1) Função para incluir dados
    function addUser(user) {
        const users = getUsers();
        users.push(user);
        saveUsers(users);
        loadUsers(); // Recarrega para manter a ordem e consistência
    }
    
    // (2) Função para excluir um item
    function deleteUser(userId) {
        let users = getUsers();
        users = users.filter(user => user.id !== userId);
        saveUsers(users);
        loadUsers();
    }

    // (3) Função para excluir todos os itens
    function clearAllUsers() {
        saveUsers([]); // Salva um array vazio
        loadUsers();
    }
    
    // (4) Função para pesquisar
    function searchUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const users = getUsers();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    }
    
    // (5) Função para carregar e exibir usuários (usada na inicialização e atualizações)
    function loadUsers() {
        const users = getUsers();
        renderUsers(users);
    }
}
);