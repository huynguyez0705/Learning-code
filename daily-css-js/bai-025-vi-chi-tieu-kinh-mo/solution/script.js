const STORAGE_KEY = 'bai-025-chi-tieu';
const sample = [
	{ id: 1, amount: 45000, category: 'an-uong', note: 'Cà phê sáng', date: '2026-11-24' },
	{ id: 2, amount: 120000, category: 'di-chuyen', note: 'Đổ xăng', date: '2026-11-23' },
	{ id: 3, amount: 890000, category: 'mua-sam', note: 'Giày chạy bộ', date: '2026-11-21' },
	{ id: 4, amount: 150000, category: 'giai-tri', note: 'Vé xem phim', date: '2026-11-20' },
];
const categoryNames = { 'an-uong': 'Ăn uống', 'di-chuyen': 'Di chuyển', 'mua-sam': 'Mua sắm', 'giai-tri': 'Giải trí' };

const moneyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const compactFormatter = new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 });
const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const app = document.querySelector('[data-app]');
const form = app.querySelector('[data-form]');
const list = app.querySelector('[data-list]');
const total = app.querySelector('[data-total]');
const summary = app.querySelector('[data-summary]');
const empty = app.querySelector('[data-empty]');
const toast = app.querySelector('[data-toast]');
const toastText = app.querySelector('[data-toast-text]');
const undoButton = app.querySelector('[data-undo]');
const itemTemplate = app.querySelector('[data-item-template]');
const filterButtons = app.querySelectorAll('[data-filter]');

const todayText = new Intl.DateTimeFormat('en-CA').format(new Date());
const state = { items: loadItems(), filter: 'all', removed: null };
let toastTimer = 0;

function loadItems() {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (raw === null) {
		return sample.slice();
	}
	return JSON.parse(raw);
}

function saveItems() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function getVisible() {
	return state.items
		.filter(function (item) { return state.filter === 'all' || item.category === state.filter; })
		.sort(function (a, b) { return b.date.localeCompare(a.date); });
}

function createItem(item) {
	const li = itemTemplate.content.firstElementChild.cloneNode(true);
	li.dataset.id = item.id;
	li.dataset.category = item.category;
	li.querySelector('[data-note]').textContent = item.note;
	li.querySelector('[data-meta]').textContent = categoryNames[item.category] + ' · ' + dateFormatter.format(new Date(item.date));
	li.querySelector('[data-amount]').textContent = moneyFormatter.format(item.amount);
	li.querySelector('[data-remove]').setAttribute('aria-label', 'Xoá ' + item.note);
	return li;
}

function render() {
	const visible = getVisible();
	const sum = visible.reduce(function (result, item) { return result + item.amount; }, 0);
	list.replaceChildren(...visible.map(createItem));
	empty.hidden = visible.length > 0;
	total.textContent = moneyFormatter.format(sum);
	summary.textContent = visible.length + ' khoản · khoảng ' + compactFormatter.format(sum) + ' ₫';
	filterButtons.forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.filter === state.filter));
	});
}

function showToast(text, canUndo) {
	clearTimeout(toastTimer);
	toastText.textContent = text;
	undoButton.hidden = !canUndo;
	toast.hidden = false;
	toastTimer = setTimeout(hideToast, 5000);
}

function hideToast() {
	toast.hidden = true;
	state.removed = null;
}

function handleSubmit(event) {
	event.preventDefault();
	if (!form.reportValidity()) {
		return;
	}
	const data = Object.fromEntries(new FormData(form));
	state.items.unshift({ id: Date.now(), amount: Number(data.amount), category: data.category, note: data.note.trim(), date: data.date });
	state.filter = 'all';
	saveItems();
	form.reset();
	form.elements.date.value = todayText;
	render();
	showToast('Đã thêm khoản chi', false);
	form.elements.amount.focus();
}

function removeItem(id) {
	const index = state.items.findIndex(function (item) { return String(item.id) === id; });
	const removedItem = state.items.splice(index, 1)[0];
	state.removed = { item: removedItem, index: index };
	saveItems();
	render();
	showToast('Đã xoá "' + removedItem.note + '"', true);
	undoButton.focus();
}

function undoRemove() {
	if (state.removed === null) {
		return;
	}
	state.items.splice(state.removed.index, 0, state.removed.item);
	const id = state.removed.item.id;
	hideToast();
	state.filter = 'all';
	saveItems();
	render();
	list.querySelector('[data-id="' + id + '"] [data-remove]').focus();
}

function handleClick(event) {
	const filterButton = event.target.closest('[data-filter]');
	if (filterButton) {
		state.filter = filterButton.dataset.filter;
		render();
		return;
	}
	const removeButton = event.target.closest('[data-remove]');
	if (removeButton) {
		removeItem(removeButton.closest('[data-item]').dataset.id);
		return;
	}
	if (event.target.closest('[data-undo]')) {
		undoRemove();
	}
}

function handleStorage(event) {
	if (event.key !== STORAGE_KEY) {
		return;
	}
	state.items = loadItems();
	render();
}

form.elements.date.max = todayText;
form.elements.date.value = todayText;
form.addEventListener('submit', handleSubmit);
app.addEventListener('click', handleClick);
window.addEventListener('storage', handleStorage);
render();
