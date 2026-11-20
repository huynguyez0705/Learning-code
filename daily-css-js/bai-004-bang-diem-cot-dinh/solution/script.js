const wrap = document.querySelector('[data-table]');
const scroller = wrap.querySelector('[data-scroll]');
const pinButton = document.querySelector('[data-pin]');
const status = document.querySelector('[data-status]');
let waiting = false;

function setPinned(isPinned) {
	wrap.toggleAttribute('data-pinned', isPinned);
	pinButton.setAttribute('aria-pressed', String(isPinned));
}

function updateScrolled() {
	wrap.toggleAttribute('data-scrolled', scroller.scrollLeft > 0);
	waiting = false;
}

function setRow(row, isSelected) {
	row.toggleAttribute('data-selected', isSelected);
	row.querySelector('[data-select]').setAttribute('aria-pressed', String(isSelected));
}

function toggleRow(row) {
	const previous = wrap.querySelector('[data-row][data-selected]');
	if (previous) {
		setRow(previous, false);
	}
	if (previous === row) {
		status.textContent = 'Chưa chọn học sinh nào';
		return;
	}
	setRow(row, true);
	status.textContent = 'Đang chọn: ' + row.querySelector('[data-select]').textContent;
}

pinButton.addEventListener('click', function () {
	setPinned(!wrap.hasAttribute('data-pinned'));
});

scroller.addEventListener(
	'scroll',
	function () {
		if (waiting) {
			return;
		}
		waiting = true;
		requestAnimationFrame(updateScrolled);
	},
	{ passive: true }
);

wrap.addEventListener('click', function (event) {
	const button = event.target.closest('[data-select]');
	if (button) {
		toggleRow(button.closest('[data-row]'));
	}
});
