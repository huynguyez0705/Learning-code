const cards = document.querySelectorAll('[data-card]');

function setMenu(card, isOpen) {
	const button = card.querySelector('[data-menu-button]');
	card.toggleAttribute('data-open', isOpen);
	button.setAttribute('aria-expanded', String(isOpen));
	if (isOpen) {
		card.querySelector('[data-menu] button').focus();
	}
}

function closeOthers(keepCard) {
	cards.forEach(function (card) {
		if (card !== keepCard && card.hasAttribute('data-open')) {
			setMenu(card, false);
		}
	});
}

cards.forEach(function (card) {
	const button = card.querySelector('[data-menu-button]');
	button.addEventListener('click', function () {
		const willOpen = !card.hasAttribute('data-open');
		closeOthers(card);
		setMenu(card, willOpen);
	});
});

document.addEventListener('click', function (event) {
	if (!event.target.closest('[data-open]')) {
		closeOthers(null);
	}
});

document.addEventListener('keydown', function (event) {
	if (event.key !== 'Escape') {
		return;
	}
	const openCard = document.querySelector('[data-card][data-open]');
	if (openCard) {
		setMenu(openCard, false);
		openCard.querySelector('[data-menu-button]').focus();
	}
});
