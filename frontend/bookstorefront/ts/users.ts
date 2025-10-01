// users.ts - Registro y CRUD de usuarios
// - initRegister(): envía datos completos a /auth/register
// - createUser(): usa /auth/register
// - update/delete: requieren token
import Swal from 'sweetalert2';
import axios from 'axios';
import { getToken } from "./auth";
const API_URL = "http://localhost:3002";
// Modular initialization for register view
export function initRegister() {
			const registerForm = document.getElementById('registerForm');
			if (registerForm) {
					registerForm.addEventListener('submit', async (e) => {
						e.preventDefault();
						const userData = {
							name: (document.getElementById('registerName') as HTMLInputElement).value,
							lastName: (document.getElementById('registerLastname') as HTMLInputElement).value,
							email: (document.getElementById('registerEmail') as HTMLInputElement).value,
							passwordHash: (document.getElementById('registerPassword') as HTMLInputElement).value,
							phone: (document.getElementById('registerPhone') as HTMLInputElement).value,
							address: (document.getElementById('registerAddress') as HTMLInputElement).value,
							role: 'user' // por defecto
						};
					try {
						const res = await createUser(userData);
						if (res.status === 200) {
							Swal.fire({
								icon: 'success',
								title: '¡Registro exitoso!',
								text: 'Serás redirigido al login.',
								timer: 1200,
								showConfirmButton: false
							});
							setTimeout(() => {
								window.location.href = '../views/login.html';
							}, 1200);
						} else if (res.status === 409) {
							Swal.fire({
								icon: 'error',
								title: 'Correo ya registrado',
								text: res.data?.message || 'Intenta con otro correo.'
							});
						} else {
							Swal.fire({
								icon: 'error',
								title: 'Error en el registro',
								text: res.data?.message || 'Intenta nuevamente.'
							});
						}
					} catch (err: any) {
						Swal.fire({
							icon: 'error',
							title: 'Error en el registro',
							text: err?.response?.data?.message || 'Intenta nuevamente.'
						});
					}
				});
			}
}

// users.ts - manejo de usuarios (CRUD)
export async function getUsers() {
	const res = await axios.get(`${API_URL}/users`);
	return res.data;
}
export async function getUserById(id: number) {
	const res = await axios.get(`${API_URL}/users/${id}`);
	return res.data;
}
export async function createUser(userData: any) {
	// Registro debe ir a /auth/register
	const res = await axios.post(`${API_URL}/auth/register`, userData);
	return res;
}
export async function updateUser(id: number, userData: any) {
	const token = getToken();
	const res = await axios.put(`${API_URL}/users/${id}`, userData, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return res.data;
}
export async function deleteUser(id: number) {
	const token = getToken();
	const res = await axios.delete(`${API_URL}/users/${id}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return res.data;
}
