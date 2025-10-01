// books.ts - Lógica de vistas de libros
// - initEditBooks(): vista admin (guard admin)
// - initSearchBooks(): vista usuario (guard user)
// - initHome(): página principal con cards
// - CRUD: get/create/update/delete usando API del backend
import Swal from 'sweetalert2';
import axios from 'axios';
import { getToken } from "./auth";
const API_URL = "http://localhost:3002";

// Modular initialization for edit-books view
export function initEditBooks() {
	// Ejemplo: mostrar lista de libros y permitir editar/eliminar
	// Guardian: solo admin puede ver esta vista
	const token = localStorage.getItem('token');
	let role = 'user';
	let valid = false;
	if (token) {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			role = payload.role || 'user';
			if (role === 'admin') valid = true;
		} catch {}
	}
	if (!valid) {
		import('sweetalert2').then(Swal => {
			Swal.default.fire({
				icon: 'error',
				title: 'Acceso denegado',
				text: 'Debes iniciar sesión como administrador.'
			});
		});
		setTimeout(() => {
			localStorage.removeItem('token');
			window.location.href = './login.html';
		}, 1500);
		return;
	}
	// Helpers de UI
	const booksTableBody = document.getElementById('booksTableBody');
	const addBookBtn = document.getElementById('addBookBtn');

	const renderAdminTable = async () => {
		if (!booksTableBody) return;
		try {
			const books = await getBooks();
			booksTableBody.innerHTML = books.length
				? books.map((book: any) => `
					<tr>
						<td>${book.bookId}</td>
						<td>${book.title}</td>
						<td>${book.author}</td>
						<td>
							<button class="btn btn-warning btn-sm" data-id="${book.bookId}" data-action="edit">Edit</button>
							<button class="btn btn-danger btn-sm" data-id="${book.bookId}" data-action="delete">Delete</button>
						</td>
					</tr>
				`).join('')
				: '<tr><td colspan="4">No books found.</td></tr>';
		} catch (err: any) {
			Swal.fire({ icon: 'error', title: 'Error al cargar libros', text: err.message || 'Intenta nuevamente.' });
		}
	};

	const getBookFormHtml = (b?: any) => `
		<input id="swal-title" class="swal2-input" placeholder="Title" value="${b?.title ?? ''}" />
		<input id="swal-author" class="swal2-input" placeholder="Author" value="${b?.author ?? ''}" />
		<input id="swal-genre" class="swal2-input" placeholder="Genre" value="${b?.genre ?? ''}" />
		<input id="swal-language" class="swal2-input" placeholder="Language" value="${b?.language ?? ''}" />
		<input id="swal-cover" class="swal2-input" placeholder="Cover URL" value="${b?.cover_url ?? ''}" />
		<input id="swal-isbn" class="swal2-input" placeholder="ISBN (optional)" value="${b?.isbn ?? ''}" />
		<textarea id="swal-desc" class="swal2-textarea" placeholder="Description">${b?.description ?? ''}</textarea>
	`;

	const readBookFormValues = () => {
		const title = (document.getElementById('swal-title') as HTMLInputElement)?.value.trim();
		const author = (document.getElementById('swal-author') as HTMLInputElement)?.value.trim();
		const genre = (document.getElementById('swal-genre') as HTMLInputElement)?.value.trim();
		const language = (document.getElementById('swal-language') as HTMLInputElement)?.value.trim();
		const cover_url = (document.getElementById('swal-cover') as HTMLInputElement)?.value.trim();
		const isbn = (document.getElementById('swal-isbn') as HTMLInputElement)?.value.trim();
		const description = (document.getElementById('swal-desc') as HTMLTextAreaElement)?.value.trim();
		if (!title || !author || !genre || !language || !cover_url || !description) {
			Swal.showValidationMessage('Todos los campos son requeridos excepto ISBN');
			return null;
		}
		const payload: any = { title, author, genre, language, cover_url, description };
		if (isbn) payload.isbn = isbn;
		return payload;
	};

	// Cargar tabla al entrar
	renderAdminTable();

	// Crear libro
	if (addBookBtn) {
		addBookBtn.addEventListener('click', async () => {
			const result = await Swal.fire({
				title: 'Add new book',
				html: getBookFormHtml(),
				focusConfirm: false,
				showCancelButton: true,
				confirmButtonText: 'Create',
				preConfirm: () => readBookFormValues()
			});
			if (result.isConfirmed && result.value) {
				try {
					await createBook(result.value);
					await renderAdminTable();
				} catch (err: any) {
					Swal.fire({ icon: 'error', title: 'Error al crear libro', text: err.response?.data?.message || err.message || 'Intenta nuevamente.' });
				}
			}
		});
	}

	// Editar / Eliminar libro (delegación)
	if (booksTableBody) {
		booksTableBody.addEventListener('click', async (e) => {
			const target = e.target as HTMLElement;
			const btn = target.closest('button') as HTMLButtonElement | null;
			if (!btn) return;
			const idStr = btn.getAttribute('data-id');
			const action = btn.getAttribute('data-action');
			const id = idStr ? parseInt(idStr, 10) : NaN;
			if (!id || Number.isNaN(id)) return;

			if (action === 'edit' || btn.classList.contains('btn-warning')) {
				try {
					const book = await getBookById(id);
					const result = await Swal.fire({
						title: `Edit book #${id}`,
						html: getBookFormHtml(book),
						focusConfirm: false,
						showCancelButton: true,
						confirmButtonText: 'Save',
						preConfirm: () => readBookFormValues()
					});
					if (result.isConfirmed && result.value) {
						await updateBook(id, result.value);
						await renderAdminTable();
					}
				} catch (err: any) {
					Swal.fire({ icon: 'error', title: 'Error al editar libro', text: err.response?.data?.message || err.message || 'Intenta nuevamente.' });
				}
			}

			if (action === 'delete' || btn.classList.contains('btn-danger')) {
				const confirm = await Swal.fire({
					title: `Delete book #${id}?`,
					text: 'Esta acción no se puede deshacer',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Delete'
				});
				if (confirm.isConfirmed) {
					try {
						await deleteBook(id);
						await renderAdminTable();
					} catch (err: any) {
						Swal.fire({ icon: 'error', title: 'Error al eliminar libro', text: err.response?.data?.message || err.message || 'Intenta nuevamente.' });
					}
				}
			}
		});
	}
}

// Modular initialization for search-books view
export function initSearchBooks() {
			// Guardian: solo usuarios autenticados pueden ver esta vista
			const token = localStorage.getItem('token');
			let role = 'user';
			let valid = false;
			if (token) {
				try {
					const payload = JSON.parse(atob(token.split('.')[1]));
					role = payload.role || 'user';
					if (role === 'user') valid = true;
				} catch {}
			}
			if (!valid) {
				import('sweetalert2').then(Swal => {
					Swal.default.fire({
						icon: 'error',
						title: 'Acceso denegado',
						text: 'Debes iniciar sesión como usuario.'
					});
				});
				setTimeout(() => {
					localStorage.removeItem('token');
					window.location.href = './login.html';
				}, 1500);
				return;
			}
		// Cargar libros al entrar
		const searchBooksCards = document.getElementById('searchBooksCards');
		if (searchBooksCards) {
			getBooks().then(books => {
				searchBooksCards.innerHTML = books.length
					? books.map((book: any) => `
							<div class="card">
								<div class="card-body">
									<h5 class="card-title">${book.title}</h5>
									<p class="card-text">${book.author}</p>
								</div>
							</div>
						`).join('')
					: '<p>No books found.</p>';
			}).catch(err => {
				import('sweetalert2').then(Swal => {
					Swal.default.fire({
						icon: 'error',
						title: 'Error al cargar libros',
						text: err.message || 'Intenta nuevamente.'
					});
				});
			});
		}
		// Buscar libros por título/autor
		const searchForm = document.getElementById('searchForm');
		if (searchForm && searchBooksCards) {
			searchForm.addEventListener('submit', async (e) => {
				e.preventDefault();
				const input = document.getElementById('searchInput') as HTMLInputElement;
				const query = input.value.trim().toLowerCase();
				try {
					const books = await getBooks();
					const filtered = books.filter((b: any) =>
						b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
					);
					searchBooksCards.innerHTML = filtered.length
						? filtered.map((book: any) => `
								<div class="card mb-2">
									<div class="card-body">
										<h5 class="card-title">${book.title}</h5>
										<p class="card-text">${book.author}</p>
									</div>
								</div>
							`).join('')
						: '<p>No books found.</p>';
				} catch (err: any) {
					import('sweetalert2').then(Swal => {
						Swal.default.fire({
							icon: 'error',
							title: 'Error al buscar libros',
							text: err.message || 'Intenta nuevamente.'
						});
					});
				}
			});
		}
}
// Modular initialization for home view
export function initHome() {
	const booksCards = document.getElementById('mainBooksCards');
	if (booksCards) {
		getBooks().then(books => {
			booksCards.innerHTML = books.map((book: any) => `
				<div class="card">
					<div class="card-body">
						<h5 class="card-title">${book.title}</h5>
						<p class="card-text">${book.author}</p>
					</div>
				</div>
			`).join('');
		});
	}

	const searchForm = document.getElementById('mainSearchForm');
	if (searchForm) {
		searchForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const input = document.getElementById('mainSearchInput') as HTMLInputElement;
			const query = input.value.trim().toLowerCase();
			const books = await getBooks();
			const filtered = books.filter((b: any) =>
				b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
			);
			booksCards!.innerHTML = filtered.length
				? filtered.map((book: any) => `
						<div class="card">
							<div class="card-body">
								<h5 class="card-title">${book.title}</h5>
								<p class="card-text">${book.author}</p>
							</div>
						</div>
					`).join('')
				: '<p>No books found.</p>';
		});
	}
}
// books.ts - manejo de libros (CRUD)

export async function getBooks() {
	const res = await axios.get(`${API_URL}/books`);
	return res.data;
}
export async function getBookById(id: number) {
	const res = await axios.get(`${API_URL}/books/${id}`);
	return res.data;
}
export async function createBook(bookData: any) {
	const token = getToken();
	try {
		const res = await axios.post(`${API_URL}/books`, bookData, {
			headers: { Authorization: `Bearer ${token}` }
		});
		Swal.fire({
			icon: 'success',
			title: 'Libro creado',
			text: 'El libro se ha creado correctamente.',
			timer: 1200,
			showConfirmButton: false
		});
		return res.data;
	} catch (err: any) {
		Swal.fire({
			icon: 'error',
			title: 'Error al crear libro',
			text: err.message || 'Intenta nuevamente.'
		});
		throw err;
	}
}
export async function updateBook(id: number, bookData: any) {
	const token = getToken();
	try {
		const res = await axios.put(`${API_URL}/books/${id}`, bookData, {
			headers: { Authorization: `Bearer ${token}` }
		});
		Swal.fire({
			icon: 'success',
			title: 'Libro editado',
			text: 'El libro se ha editado correctamente.',
			timer: 1200,
			showConfirmButton: false
		});
		return res.data;
	} catch (err: any) {
		Swal.fire({
			icon: 'error',
			title: 'Error al editar libro',
			text: err.message || 'Intenta nuevamente.'
		});
		throw err;
	}
}
export async function deleteBook(id: number) {
	const token = getToken();
	try {
		const res = await axios.delete(`${API_URL}/books/${id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		Swal.fire({
			icon: 'success',
			title: 'Libro eliminado',
			text: 'El libro se ha eliminado correctamente.',
			timer: 1200,
			showConfirmButton: false
		});
		return res.data;
	} catch (err: any) {
		Swal.fire({
			icon: 'error',
			title: 'Error al eliminar libro',
			text: err.message || 'Intenta nuevamente.'
		});
		throw err;
	}
}
