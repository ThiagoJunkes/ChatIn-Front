const url = 'http://localhost:3000'; // URL da sua API
let conversaId = null; // Variável global para armazenar o ID da conversa atual
let apelidoAtual = null; // Variável global para armazenar o apelido da conversa atual
let nomeAtual = null; // Variável global para armazenar o nome completo da conversa atual
let token = null; // Variável global para armazenar o token do usuário

// Função para carregar a lista de conversas do usuário usando o token
async function carregarConversasUsuario() {
    token = localStorage.getItem('token'); // Armazena o token globalmente

    try {
        const response = await fetch(`${url}/conversa/usuario?token=${token}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar conversas');
        }

        const conversas = await response.json();
        exibirListaDeContatos(conversas);
    } catch (error) {
        console.error('Erro ao carregar as conversas:', error);
    }
}

// Função para exibir a lista de contatos na sidebar
function exibirListaDeContatos(conversas) {
    const contactList = document.querySelector('.contact-list');
    contactList.innerHTML = ''; // Limpa a lista antes de adicionar os contatos

    conversas.forEach(conversa => {
        const contactElement = document.createElement('div');
        contactElement.classList.add('contact');
        contactElement.innerHTML = `
            <div class="contact-name">${conversa.apelido}</div>
        `;

        contactElement.onclick = () => loadConversation(conversa.id, conversa.apelido, conversa.nome_completo);
        contactList.appendChild(contactElement);
    });
}

// Função para carregar uma conversa específica quando um contato é clicado
async function loadConversation(id, contactName, contactNomeCompleto) {
    if(id && contactName && contactNomeCompleto){
        conversaId = id; // Armazena o ID da conversa globalmente
        apelidoAtual = contactName; // Armazena o Aplido da conversa globalmente
        nomeAtual = contactNomeCompleto;  // Armazena o Nome Completo da conversa globalmente
    }

    document.getElementById('contact-name').innerText = nomeAtual;
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
            const sender = msg.fk_user === 2 ? 'Você' : apelidoAtual; // Ajuste conforme o usuário autenticado
            messageElement.classList.add('message', sender === 'Você' ? 'sent' : 'received');

            // Substituir \n por <br> para exibir a quebra de linha
            const formattedMessage = msg.mensagem.replace(/\n/g, '<br>');

            messageElement.innerHTML = `
                <div class="message-text">${formattedMessage}</div>
                <div class="message-time">${new Date(msg.dt_msg_send).toLocaleTimeString()}</div>
            `;
            chatBody.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Erro ao carregar a conversa:', error);
    }
}

// Função para enviar uma nova mensagem
async function sendMessage(message) {
    const encodedMessage = encodeURIComponent(message); // Codifica a mensagem
    try {
        const response = await fetch(`${url}/conversa/historico/${conversaId}?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mensagem: encodedMessage }) // Enviando a mensagem no corpo da requisição
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar a mensagem');
        }

        // Limpa o campo de input após o envio da mensagem
        document.getElementById('message-input').value = '';
        loadConversation();

    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
    }
}

// Evento para enviar a mensagem ao clicar no botão de envio
document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const messageText = input.value.trim();
    
    if (messageText === '') return; // Não enviar se a mensagem estiver vazia

    sendMessage(messageText); // Enviar a mensagem
});

// Carrega as conversas do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', carregarConversasUsuario);
