// main.ts - Punto de entrada del frontend (Vite)
// - Importa estilos globales
// - Detecta la página actual y ejecuta su init correspondiente
import '../styles/styles.css';
console.log('main.ts cargado');
import { initHome, initEditBooks, initSearchBooks } from './books';
import { initLogin, logout } from './auth';
import { initRegister } from './users';

document.addEventListener('DOMContentLoaded', () => {
  // Wire global logout if present in the page
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      try { logout(); } catch {}
      // Always send to the login page on logout to allow switching accounts
      window.location.href = `${window.location.origin}/views/login.html`;
    });
  }

  const path = window.location.pathname;
  console.log('window.location.pathname:', path);
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/bookstorefront/')) {
    initHome();
  } else if (path.endsWith('login.html') || path.endsWith('/login')) {
    initLogin();
  } else if (path.endsWith('register.html') || path.endsWith('/register')) {
    initRegister();
  } else if (path.endsWith('edit-books.html') || path.endsWith('/edit-books')) {
    initEditBooks();
  } else if (path.endsWith('search-books.html') || path.endsWith('/search-books')) {
    initSearchBooks();
  }
});

