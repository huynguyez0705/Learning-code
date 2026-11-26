const storageKey = 'bai-020-ghi-chu';
const maxLength = 120;
const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-input]');
const counter = document.querySelector('[data-counter]');
const addButton = document.querySelector('[data-add]');
const list = document.querySelector('[data-list]');
const count = document.querySelector('[data-count]');
const empty = document.querySelector('[data-empty]');
const noteTemplate = document.querySelector('[data-note-template]');
const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
const seedNotes = [
	{ id: 1, text: 'Mua sữa và trứng trên đường về.', color: 'amber', createdAt: 1764000000000 },
	{ id: 2, text: 'Ôn lại bài về localStorage trước 9 giờ.', color: 'sky', createdAt: 1764003600000 },
];

function loadNotes() {
	const saved = localStorage.getItem(storageKey);
	if (saved === null) {
		return seedNotes;
	}
	return JSON.parse(saved);
}

const state = { notes: loadNotes() };

function saveNotes() {
	localStorage.setItem(storageKey, JSON.stringify(state.notes));
}

function createCard(note) {
	const card = noteTemplate.content.firstElementChild.cloneNode(true);
	card.dataset.id = note.id;
	card.dataset.color = note.color;
	card.querySelector('[data-text]').textContent = note.text;
	const time = card.querySelector('[data-time]');
	time.textContent = dateFormat.format(note.createdAt);
	time.dateTime = new Date(note.createdAt).toISOString();
	return card;
}

function renderNotes() {
	list.replaceChildren(...state.notes.map(createCard));
	empty.hidden = state.notes.length > 0;
	count.textContent = `Có ${state.notes.length} ghi chú`;
}

function renderForm() {
	const length = input.value.length;
	counter.textContent = `${length}/${maxLength}`;
	counter.toggleAttribute('data-warning', maxLength - length <= 20);
	addButton.disabled = input.value.trim() === '';
}

function handleSubmit(event) {
	event.preventDefault();
	const text = input.value.trim();
	if (text === '') {
		return;
	}
	state.notes.unshift({
		id: Date.now(),
		text: text,
		color: form.elements.color.value,
		createdAt: Date.now(),
	});
	saveNotes();
	form.reset();
	renderForm();
	renderNotes();
	input.focus();
}

function handleListClick(event) {
	const button = event.target.closest('[data-delete]');
	if (button === null) {
		return;
	}
	const id = Number(button.closest('[data-card]').dataset.id);
	state.notes = state.notes.filter(function (note) {
		return note.id !== id;
	});
	saveNotes();
	renderNotes();
	input.focus();
}

function handlePointerMove(event) {
	const card = event.target.closest('[data-card]');
	if (card === null) {
		return;
	}
	const rect = card.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	const tiltX = (0.5 - y / rect.height) * 12;
	const tiltY = (x / rect.width - 0.5) * 12;
	card.style.setProperty('--mx', `${x}px`);
	card.style.setProperty('--my', `${y}px`);
	card.style.setProperty('--rx', `${tiltX.toFixed(1)}deg`);
	card.style.setProperty('--ry', `${tiltY.toFixed(1)}deg`);
}

function handlePointerOut(event) {
	const card = event.target.closest('[data-card]');
	if (card === null || card.contains(event.relatedTarget)) {
		return;
	}
	card.style.setProperty('--rx', '0deg');
	card.style.setProperty('--ry', '0deg');
}

input.addEventListener('input', renderForm);
form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleListClick);
list.addEventListener('pointermove', handlePointerMove);
list.addEventListener('pointerout', handlePointerOut);

renderForm();
renderNotes();
