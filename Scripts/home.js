document.addEventListener("DOMContentLoaded", () => {
    // Função para verificar se o token existe
    function verificarToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            // Se o token não existir, redireciona para a página de login
            window.location.href = 'Login/login.html';
        }
    }

    // Verifica o token quando a página é carregada
    verificarToken();

    // Evento para enviar a mensagem ao pressionar Enter (sem Shift)
    document.getElementById('message-input').addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Impede quebra de linha ao pressionar apenas Enter
            document.getElementById('send-btn').click(); // Simula o clique no botão de envio
        }
    });
});
