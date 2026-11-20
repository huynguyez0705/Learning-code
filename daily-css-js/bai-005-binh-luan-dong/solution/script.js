const page = document.querySelector('[data-page]');
const thread = document.querySelector('[data-thread]');
const heading = document.querySelector('[data-heading]');
const count = document.querySelector('[data-count]');
const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-input]');
const error = document.querySelector('[data-error]');
const list = document.querySelector('[data-list]');
const template = document.querySelector('[data-template]');
const dialog = document.querySelector('[data-dialog]');
const dialogText = document.querySelector('[data-dialog-text]');
const cancelButton = document.querySelector('[data-cancel]');
const confirmButton = document.querySelector('[data-confirm]');
const backdrop = document.querySelector('[data-backdrop]');
let currentComment = null;
let lastTrigger = null;

function syncComments() {
	const total = list.querySelectorAll('[data-comment]').length;
	count.textContent = String(total);
	thread.toggleAttribute('data-empty', total === 0);
}

function setDialog(isOpen) {
	dialog.toggleAttribute('data-open', isOpen);
	page.toggleAttribute('inert', isOpen);
}

function openDialog(comment, trigger) {
	currentComment = comment;
	lastTrigger = trigger;
	dialogText.textContent = comment.querySelector('[data-comment-text]').textContent;
	setDialog(true);
	cancelButton.focus();
}

function closeDialog() {
	setDialog(false);
	lastTrigger.focus();
	currentComment = null;
	lastTrigger = null;
}

function deleteComment() {
	currentComment.closest('li').remove();
	syncComments();
	setDialog(false);
	heading.focus();
	currentComment = null;
	lastTrigger = null;
}

function addComment(event) {
	event.preventDefault();
	const text = input.value.trim();
	if (text === '') {
		error.textContent = 'Hãy viết nội dung trước khi gửi.';
		input.setAttribute('aria-invalid', 'true');
		input.focus();
		return;
	}
	const fragment = template.content.cloneNode(true);
	fragment.querySelector('[data-comment-text]').textContent = text;
	list.append(fragment);
	form.reset();
	error.textContent = '';
	input.setAttribute('aria-invalid', 'false');
	syncComments();
	input.focus();
}

function handleListClick(event) {
	const button = event.target.closest('[data-delete]');
	if (!button) {
		return;
	}
	openDialog(button.closest('[data-comment]'), button);
}

form.addEventListener('submit', addComment);
list.addEventListener('click', handleListClick);
cancelButton.addEventListener('click', closeDialog);
backdrop.addEventListener('click', closeDialog);
confirmButton.addEventListener('click', deleteComment);

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' && dialog.hasAttribute('data-open')) {
		closeDialog();
	}
});

syncComments();
