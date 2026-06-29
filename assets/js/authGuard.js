(async function verifyAdminAccess() {
  const API_VERIFY = 'http://127.0.0.1:8000/api/users/verify-admin';

  try {
    const response = await axios.get(API_VERIFY, {
      withCredentials: true,
    });

    if (response.status === 200) {
      console.log('Acceso concedido: Usuario Administrador');
    }
  } catch (error) {
    console.warn('Acceso denegado, redirigiendo al login...');

    const mensaje =
      error.response?.data?.message || 'Sesión expirada o acceso denegado.';
    alert(mensaje);

    window.location.replace('/pages/login.html');
  }
})();
