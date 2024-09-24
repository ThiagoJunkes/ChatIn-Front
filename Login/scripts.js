const url = 'http://localhost:3000';

async function validarLogin(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch(url+'/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token } = data;
      sessionStorage.setItem('token', token);
      window.location.href = './area-admin.html';
      
    } else {
      alert('Usuário ou senha inválidos');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login. Tente novamente mais tarde.');
  }
}