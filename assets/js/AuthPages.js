import { isAuthenticated } from '../../services/authService.js'; // ajustá el path según donde viva este archivo

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    window.location.href = 'pages/login.html';
  }
  return authenticated;
}
