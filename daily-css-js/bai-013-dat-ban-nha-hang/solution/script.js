const form = document.querySelector('[data-form]');
const slotInputs = Array.from(form.querySelectorAll('input[name="slot"]'));
const nameInput = form.querySelector('[data-name]');
const stepper = form.querySelector('[data-stepper]');
const decreaseButton = stepper.querySelector('[data-step="-1"]');
const increaseButton = stepper.querySelector('[data-step="1"]');
const guestsOutput = form.querySelector('[data-guests-output]');
const message = document.querySelector('[data-message]');
const listTitle = document.querySelector('[data-list-title]');
const list = document.querySelector('[data-bookings]');
const empty = document.querySelector('[data-empty]');
const summary = document.querySelector('[data-summary]');
const template = document.querySelector('[data-booking-template]');
const minGuests = 1;
const maxGuests = 8;
const defaultGuests = 2;
let guests = defaultGuests;
let counter = 0;
let messageTimer = null;

function getBookings() {
	return Array.from(list.querySelectorAll('[data-booking]'));
}

function showMessage(text, type) {
	clearTimeout(messageTimer);
	message.textContent = text;
	message.dataset.type = type;
	messageTimer = setTimeout(function () {
		message.textContent = '';
		message.removeAttribute('data-type');
	}, 3000);
}

function renderGuests() {
	guestsOutput.textContent = guests;
	decreaseButton.disabled = guests === minGuests;
	increaseButton.disabled = guests === maxGuests;
}

function render() {
	const bookings = getBookings();
	const takenSlots = bookings.map(function (booking) {
		return booking.dataset.slot;
	});
	const totalGuests = bookings.reduce(function (sum, booking) {
		return sum + Number(booking.dataset.guests);
	}, 0);
	slotInputs.forEach(function (input) {
		input.disabled = takenSlots.includes(input.value);
	});
	empty.hidden = bookings.length > 0;
	summary.textContent = `Đã đặt ${bookings.length}/${slotInputs.length} khung giờ · ${totalGuests} khách`;
}

function createBooking(slot, name, guestCount) {
	counter += 1;
	const item = template.content.firstElementChild.cloneNode(true);
	item.dataset.slot = slot;
	item.dataset.guests = guestCount;
	item.querySelector('[data-booking-code]').textContent = `#B${String(counter).padStart(2, '0')}`;
	item.querySelector('[data-booking-time]').textContent = slot;
	item.querySelector('[data-booking-name]').textContent = name;
	item.querySelector('[data-booking-guests]').textContent = `${guestCount} khách`;
	const later = getBookings().find(function (booking) {
		return booking.dataset.slot.localeCompare(slot) > 0;
	});
	if (later) {
		later.before(item);
	} else {
		list.append(item);
	}
}

stepper.addEventListener('click', function (event) {
	const button = event.target.closest('[data-step]');
	if (!button) {
		return;
	}
	guests = Math.max(minGuests, Math.min(maxGuests, guests + Number(button.dataset.step)));
	renderGuests();
});

form.addEventListener('submit', function (event) {
	event.preventDefault();
	const data = new FormData(form);
	const slot = data.get('slot');
	const name = data.get('name').trim();
	if (slot === null) {
		showMessage('Hãy chọn một khung giờ.', 'error');
		return;
	}
	if (name === '') {
		showMessage('Hãy nhập tên người đặt.', 'error');
		nameInput.focus();
		return;
	}
	createBooking(slot, name, guests);
	form.reset();
	guests = defaultGuests;
	renderGuests();
	render();
	showMessage(`Đã đặt bàn lúc ${slot} cho ${name}.`, 'success');
});

list.addEventListener('click', function (event) {
	const button = event.target.closest('[data-cancel]');
	if (!button) {
		return;
	}
	const booking = button.closest('[data-booking]');
	const slot = booking.dataset.slot;
	booking.remove();
	render();
	listTitle.focus();
	showMessage(`Đã huỷ bàn lúc ${slot}.`, 'success');
});

renderGuests();
render();
