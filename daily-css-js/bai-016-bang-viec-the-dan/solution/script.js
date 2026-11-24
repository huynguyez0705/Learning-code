const board = document.querySelector('[data-board]');
const form = document.querySelector('[data-form]');
const titleInput = document.querySelector('[data-title-input]');
const message = document.querySelector('[data-message]');
const template = document.querySelector('[data-card-template]');
const columns = ['todo', 'doing', 'done'];
const liftTime = 800;
let messageTimer = null;

function getList(name) {
	return board.querySelector(`[data-list="${name}"]`);
}

function getColumnName(card) {
	return card.closest('[data-column]').dataset.column;
}

function showMessage(text) {
	clearTimeout(messageTimer);
	message.textContent = text;
	messageTimer = setTimeout(function () {
		message.textContent = '';
	}, 3000);
}

function render() {
	columns.forEach(function (name) {
		const list = getList(name);
		list.closest('[data-column]').querySelector('[data-count]').textContent = list.children.length;
	});
	board.querySelectorAll('[data-card]').forEach(function (card) {
		const index = columns.indexOf(getColumnName(card));
		card.querySelector('[data-move="-1"]').disabled = index === 0;
		card.querySelector('[data-move="1"]').disabled = index === columns.length - 1;
	});
}

function liftCard(card) {
	clearTimeout(Number(card.dataset.timer));
	card.dataset.lifted = '';
	card.dataset.timer = setTimeout(function () {
		card.removeAttribute('data-lifted');
	}, liftTime);
}

function moveCard(card, step) {
	const from = columns.indexOf(getColumnName(card));
	const to = Math.max(0, Math.min(columns.length - 1, from + step));
	if (to === from) {
		return false;
	}
	const target = getList(columns[to]);
	const limit = Number(target.closest('[data-column]').dataset.limit);
	if (limit && target.children.length >= limit) {
		showMessage(`Cột này chỉ nhận tối đa ${limit} việc.`);
		return false;
	}
	target.append(card);
	liftCard(card);
	render();
	return true;
}

board.addEventListener('click', function (event) {
	const card = event.target.closest('[data-card]');
	if (!card) {
		return;
	}
	const moveButton = event.target.closest('[data-move]');
	if (moveButton) {
		if (moveCard(card, Number(moveButton.dataset.move))) {
			const focusTarget = moveButton.disabled ? card.querySelector('[data-move]:not(:disabled)') : moveButton;
			focusTarget.focus();
		}
		return;
	}
	if (event.target.closest('[data-remove]')) {
		const section = card.closest('[data-column]');
		card.remove();
		render();
		section.querySelector('[data-column-title]').focus();
	}
});

form.addEventListener('submit', function (event) {
	event.preventDefault();
	const title = new FormData(form).get('title').trim();
	if (title === '') {
		showMessage('Hãy nhập tên việc.');
		titleInput.focus();
		return;
	}
	const card = template.content.firstElementChild.cloneNode(true);
	card.querySelector('[data-card-title]').textContent = title;
	getList('todo').append(card);
	liftCard(card);
	form.reset();
	titleInput.focus();
	render();
});

render();
