const list = document.querySelector('[data-list]');
const tabs = document.querySelector('[data-tabs]');
const bell = document.querySelector('[data-bell]');
const badge = document.querySelector('[data-badge]');
const empty = document.querySelector('[data-empty]');
const readAllButton = document.querySelector('[data-read-all]');
const filterButtons = Array.from(tabs.querySelectorAll('[data-filter]'));
const maxBadge = 9;
let filter = 'all';

function getMails() {
	return Array.from(list.querySelectorAll('[data-mail]'));
}

function isUnread(mail) {
	return mail.hasAttribute('data-unread');
}

function render() {
	const mails = getMails();
	const count = mails.filter(isUnread).length;
	badge.textContent = count > maxBadge ? `${maxBadge}+` : String(count);
	badge.hidden = count === 0;
	bell.setAttribute('aria-label', `Chuông: ${count} thư chưa đọc`);
	readAllButton.disabled = count === 0;
	mails.forEach(function (mail) {
		mail.hidden = filter === 'unread' && !isUnread(mail);
	});
	empty.hidden = !(filter === 'unread' && count === 0);
	filterButtons.forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
	});
}

list.addEventListener('click', function (event) {
	const open = event.target.closest('[data-open]');
	if (!open) {
		return;
	}
	open.closest('[data-mail]').toggleAttribute('data-unread');
	render();
});

tabs.addEventListener('click', function (event) {
	const button = event.target.closest('[data-filter]');
	if (!button) {
		return;
	}
	filter = button.dataset.filter;
	render();
});

readAllButton.addEventListener('click', function () {
	getMails().forEach(function (mail) {
		mail.toggleAttribute('data-unread', false);
	});
	render();
});

bell.addEventListener('click', function () {
	filter = 'unread';
	render();
});

render();
