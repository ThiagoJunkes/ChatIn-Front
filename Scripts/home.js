document.addEventListener("DOMContentLoaded", () => {
    // Função para verificar se o token existe
    function verificarToken() {
        const token = localStorage.getItem('token');
        console.log(' token' + token);
        if (!token) {
            // Se o token não existir, redireciona para a página de login
            window.location.href = 'Login/login.html';
        }
    }

    // Verifica o token quando a página é carregada
    verificarToken();
});
