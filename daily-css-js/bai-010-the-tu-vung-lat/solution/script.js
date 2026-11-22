const deck = document.querySelector('[data-deck]');
const cards = Array.from(deck.querySelectorAll('[data-card]'));
const position = document.querySelector('[data-position]');
const progress = document.querySelector('[data-progress]');
const status = document.querySelector('[data-status]');
const flipButton = document.querySelector('[data-flip]');
const knownButton = document.querySelector('[data-known-toggle]');
const prevButton = document.querySelector('[data-prev]');
const nextButton = document.querySelector('[data-next]');

function isActive(card) {
	return card.hasAttribute('data-active');
}

function isKnown(card) {
	return card.hasAttribute('data-known');
}

function getActiveIndex() {
	return cards.findIndex(isActive);
}

function getActiveCard() {
	return cards[getActiveIndex()];
}

function render() {
	const card = getActiveCard();
	const knownCount = cards.filter(isKnown).length;
	position.textContent = `Thẻ ${getActiveIndex() + 1}/${cards.length}`;
	progress.textContent = `Đã thuộc ${knownCount}/${cards.length} từ`;
	flipButton.setAttribute('aria-pressed', String(card.hasAttribute('data-flipped')));
	knownButton.setAttribute('aria-pressed', String(isKnown(card)));
	status.textContent = cards.every(isKnown) ? 'Bạn đã thuộc hết bộ thẻ!' : '';
}

function showCard(index) {
	const next = (index + cards.length) % cards.length;
	cards.forEach(function (card, cardIndex) {
		card.toggleAttribute('data-active', cardIndex === next);
		card.removeAttribute('data-flipped');
	});
	render();
}

function flipCard() {
	getActiveCard().toggleAttribute('data-flipped');
	render();
}

function toggleKnown() {
	getActiveCard().toggleAttribute('data-known');
	render();
}

function showPrevious() {
	showCard(getActiveIndex() - 1);
}

function showNext() {
	showCard(getActiveIndex() + 1);
}

function handleKeydown(event) {
	if (event.key === 'ArrowRight') {
		showNext();
	} else if (event.key === 'ArrowLeft') {
		showPrevious();
	} else if (event.key === ' ' || event.key === 'Enter') {
		if (event.target.closest('button')) {
			return;
		}
		event.preventDefault();
		flipCard();
	}
}

flipButton.addEventListener('click', flipCard);
knownButton.addEventListener('click', toggleKnown);
prevButton.addEventListener('click', showPrevious);
nextButton.addEventListener('click', showNext);
document.addEventListener('keydown', handleKeydown);

render();
