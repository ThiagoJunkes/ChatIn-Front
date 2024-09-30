const url = 'http://localhost:3000'; // URL da sua API

// Função para carregar a lista de conversas do usuário usando o token
async function carregarConversasUsuario() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${url}/conversa/usuario?token=${token}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar conversas');
        }

        const conversas = await response.json();
        exibirListaDeContatos(conversas, token);
    } catch (error) {
        console.error('Erro ao carregar as conversas:', error);
    }
}

// Função para exibir a lista de contatos na sidebar
function exibirListaDeContatos(conversas, token) {
    const contactList = document.querySelector('.contact-list');
    contactList.innerHTML = ''; // Limpa a lista antes de adicionar os contatos

    conversas.forEach(conversa => {
        const contactElement = document.createElement('div');
        contactElement.classList.add('contact');
        contactElement.innerHTML = `
            <div class="contact-name">${conversa.apelido}</div>
        `;
        contactElement.onclick = () => loadConversation(conversa.id, conversa.apelido, token);
        contactList.appendChild(contactElement);
    });
}

// Função para carregar uma conversa específica quando um contato é clicado
async function loadConversation(conversaId, contactName, token) {
    document.getElementById('contact-name').innerText = contactName;
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = ''; // Limpar mensagens anteriores

    try {
        const response = await fetch(`${url}/conversa/${conversaId}?token=${token}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar a conversa');
        }

        const mensagens = await response.json();
        mensagens.forEach(msg => {
            const messageElement = document.createElement('div');
            // Considera 'Você' como fk_user !== 2 (no caso o usuário atual é 2)
            const sender = msg.fk_user === 2 ? 'Você' : contactName; // Ajuste conforme o usuário autenticado
            messageElement.classList.add('message', sender === 'Você' ? 'sent' : 'received');
            messageElement.innerHTML = `
                <div class="message-text">${msg.mensagem}</div>
                <div class="message-time">${new Date(msg.dt_msg_send).toLocaleTimeString()}</div>
            `;
            chatBody.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Erro ao carregar a conversa:', error);
    }
}


// Função para enviar uma nova mensagem
document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const messageText = input.value;
    if (messageText.trim() === '') return;

    const chatBody = document.getElementById('chat-body');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'sent');
    messageElement.innerHTML = `
        <div class="message-text">${messageText}</div>
        <div class="message-time">Agora</div>
    `;
    chatBody.appendChild(messageElement);
    input.value = '';
});

// Carrega as conversas do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', carregarConversasUsuario);
