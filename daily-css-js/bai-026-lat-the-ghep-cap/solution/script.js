const STORAGE_KEY = 'bai-026-ky-luc';
const symbols = ['🍎', '🍋', '🍇', '🍓', '🥝', '🍉'];

const app = document.querySelector('[data-app]');
const board = app.querySelector('[data-board]');
const statusText = app.querySelector('[data-status]');
const movesText = app.querySelector('[data-moves]');
const bestText = app.querySelector('[data-best]');
const restartButton = app.querySelector('[data-restart]');
const cardTemplate = app.querySelector('[data-card-template]');

const state = { cards: [], first: null, locked: false, moves: 0, matched: 0, best: loadBest() };

function loadBest() {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw === null ? null : Number(raw);
}

function shuffle(list) {
	const result = list.slice();
	for (let i = result.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

function createCard(card) {
	const button = cardTemplate.content.firstElementChild.cloneNode(true);
	button.dataset.id = card.id;
	button.querySelector('[data-face]').textContent = card.symbol;
	return button;
}

function newGame() {
	const deck = shuffle(symbols.concat(symbols));
	state.cards = deck.map(function (symbol, index) {
		return { id: index, symbol: symbol, flipped: false, matched: false };
	});
	state.first = null;
	state.locked = false;
	state.moves = 0;
	state.matched = 0;
	board.replaceChildren(...state.cards.map(createCard));
	statusText.textContent = 'Lật hai thẻ giống nhau để ghép cặp.';
	update();
}

function update() {
	state.cards.forEach(function (card) {
		const button = board.querySelector('[data-id="' + card.id + '"]');
		const faceUp = card.flipped || card.matched;
		button.toggleAttribute('data-flipped', faceUp);
		button.toggleAttribute('data-matched', card.matched);
		button.setAttribute('aria-label', faceUp ? 'Thẻ ' + card.symbol : 'Thẻ úp');
	});
	movesText.textContent = state.moves;
	bestText.textContent = state.best === null ? '--' : state.best + ' lượt';
}

function finishGame() {
	state.best = state.best === null ? state.moves : Math.min(state.best, state.moves);
	localStorage.setItem(STORAGE_KEY, String(state.best));
	statusText.textContent = 'Hoàn thành sau ' + state.moves + ' lượt!';
	update();
	restartButton.focus();
}

function hideMismatch(first, second) {
	first.flipped = false;
	second.flipped = false;
	state.locked = false;
	update();
}

function flipCard(card) {
	card.flipped = true;
	if (state.first === null) {
		state.first = card;
		update();
		return;
	}
	const first = state.first;
	state.first = null;
	state.moves += 1;
	if (first.symbol === card.symbol) {
		first.matched = true;
		card.matched = true;
		state.matched += 1;
		statusText.textContent = 'Khớp rồi!';
		if (state.matched === symbols.length) {
			finishGame();
			return;
		}
		update();
		return;
	}
	state.locked = true;
	statusText.textContent = 'Chưa khớp, thử lại.';
	update();
	setTimeout(function () {
		hideMismatch(first, card);
	}, 900);
}

function handleClick(event) {
	if (event.target.closest('[data-restart]')) {
		newGame();
		return;
	}
	const button = event.target.closest('[data-card]');
	if (button === null || state.locked) {
		return;
	}
	const card = state.cards[Number(button.dataset.id)];
	if (card.flipped || card.matched) {
		return;
	}
	flipCard(card);
}

app.addEventListener('click', handleClick);
newGame();
