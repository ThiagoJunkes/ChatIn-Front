function verificarToken() {
    // Tenta obter o token armazenado no sessionStorage
    const token = localStorage.getItem('token');
  
    // Verifica se o token existe
    if (token) {
      return true;
    } else {
      return false;
    }
  }
  