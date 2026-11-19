const page = document.querySelector('[data-page]');
const heading = document.querySelector('[data-heading]');
const count = document.querySelector('[data-count]');
const dialog = document.querySelector('[data-dialog]');
const dialogName = dialog.querySelector('[data-dialog-name]');
const cancelButton = dialog.querySelector('[data-dialog-cancel]');
const confirmButton = dialog.querySelector('[data-dialog-confirm]');
const backdrop = dialog.querySelector('[data-dialog-backdrop]');
let currentCard = null;
let lastTrigger = null;

function setDialog(isOpen) {
	dialog.toggleAttribute('data-open', isOpen);
	page.toggleAttribute('inert', isOpen);
}

function openDialog(card, trigger) {
	currentCard = card;
	lastTrigger = trigger;
	dialogName.textContent = card.querySelector('[data-card-name]').textContent;
	setDialog(true);
	cancelButton.focus();
}

function closeDialog() {
	setDialog(false);
	lastTrigger.focus();
	currentCard = null;
	lastTrigger = null;
}

function confirmDelete() {
	currentCard.closest('li').remove();
	count.textContent = String(document.querySelectorAll('[data-card]').length);
	setDialog(false);
	heading.focus();
	currentCard = null;
	lastTrigger = null;
}

document.querySelectorAll('[data-card]').forEach(function (card) {
	card.querySelector('[data-delete]').addEventListener('click', function (event) {
		openDialog(card, event.currentTarget);
	});
});

cancelButton.addEventListener('click', closeDialog);
backdrop.addEventListener('click', closeDialog);
confirmButton.addEventListener('click', confirmDelete);

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' && dialog.hasAttribute('data-open')) {
		closeDialog();
	}
});
