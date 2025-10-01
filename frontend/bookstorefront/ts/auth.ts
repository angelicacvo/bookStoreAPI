// auth.ts - Autenticación (login, registro, token)
// - API_URL apunta al backend
// - initLogin: maneja auto-redirect por token y formulario de login
// - login(): hace POST /auth/login y almacena el token
import axios from 'axios';
import Swal from 'sweetalert2';
const API_URL = "http://localhost:3002";

export function initLogin() {
	console.log('initLogin ejecutándose');
	// Permitir forzar permanencia en login al cambiar de cuenta
	const params = new URLSearchParams(window.location.search);
	const forceLogin = params.get('forceLogin') === '1';
	// Si ya hay token válido y rol, redirigir automáticamente (a menos que se fuerce login)
	const token = localStorage.getItem("token");
	if (token && !forceLogin) {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const role = payload.role || "user";
			if (role === "admin") {
				window.location.href = "./edit-books.html";
				return;
			} else if (role === "user") {
				window.location.href = "./search-books.html";
				return;
			}
		} catch {}
	}
	// Si venimos forzando login, aseguramos que no quede token residual
	if (forceLogin) {
		localStorage.removeItem("token");
	}
	const loginForm = document.getElementById('loginForm');
	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
			const passwordHash = (document.getElementById('loginPassword') as HTMLInputElement).value;
			const res = await login(email, passwordHash);
			console.log('Respuesta login:', res);
			const token = localStorage.getItem("token");
			console.log('Token guardado:', token);
			if (res.ok) {
				let role = "user";
				if (token) {
					const payload = JSON.parse(atob(token.split('.')[1]));
					role = payload.role || "user";
					console.log('Payload decodificado:', payload);
				}
				Swal.fire({
					icon: 'success',
					title: 'Login exitoso!',
					text: 'Bienvenido.',
					timer: 1200,
					showConfirmButton: false
				});
				setTimeout(() => {
					if (role === "admin") {
						window.location.href = "./edit-books.html";
					} else {
						window.location.href = "./search-books.html";
					}
				}, 1200);
			} else {
				localStorage.removeItem("token");
				Swal.fire({
					icon: 'error',
					title: 'Error en el login',
					text: res.message || 'Intenta nuevamente.'
				});
			}
		});
	}
}


// auth.ts - manejo de autenticación (login, registro, token)
export async function login(email: string, password: string) {
	try {
		const res = await axios.post(`${API_URL}/auth/login`, { email, passwordHash: password });
		const data = res.data as { token?: string; message?: string };
		if (data.token) {
			localStorage.setItem("token", data.token);
			return { ok: true };
		}
		return { ok: false, message: data.message };
	} catch (err: any) {
		return { ok: false, message: err.response?.data?.message || "Login error" };
	}
}
export async function register(userData: any) {
	try {
		const res = await axios.post(`${API_URL}/auth/register`, userData);
		return res.data;
	} catch (err: any) {
		return { ok: false, message: err.response?.data?.message || "Register error" };
	}
}
export function getToken() {
	return localStorage.getItem("token");
}
export function logout() {
	localStorage.removeItem("token");
}
