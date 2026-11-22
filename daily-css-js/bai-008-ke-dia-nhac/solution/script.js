const PREVIEW_MS = 8000;

const shelf = document.querySelector('[data-shelf]');
const sorter = document.querySelector('[data-sorter]');
const now = document.querySelector('[data-now]');
const stopAllButton = document.querySelector('[data-stop-all]');

let timerId = 0;

function getAlbums() {
	return Array.from(shelf.querySelectorAll('[data-album]'));
}

function isPlaying(album) {
	return album.hasAttribute('data-playing');
}

function renderState() {
	const albums = getAlbums();
	albums.forEach(function (album) {
		const playing = isPlaying(album);
		const button = album.querySelector('[data-play]');
		button.setAttribute('aria-pressed', String(playing));
		button.textContent = playing ? 'Dừng' : 'Phát';
	});
	const current = albums.find(isPlaying);
	now.textContent = current ? `Đang phát: ${current.dataset.title}` : 'Chưa phát đĩa nào';
	stopAllButton.disabled = !albums.some(isPlaying);
}

function stopAll() {
	clearTimeout(timerId);
	getAlbums().forEach(function (album) {
		album.toggleAttribute('data-playing', false);
	});
	renderState();
}

function playAlbum(album) {
	stopAll();
	album.toggleAttribute('data-playing', true);
	timerId = setTimeout(stopAll, PREVIEW_MS);
	renderState();
}

function compareAlbums(a, b, key) {
	if (key === 'title') {
		return a.dataset.title.localeCompare(b.dataset.title, 'vi');
	}
	return Number(a.dataset[key]) - Number(b.dataset[key]);
}

function sortShelf(key) {
	const albums = getAlbums();
	albums.sort(function (a, b) {
		return compareAlbums(a, b, key);
	});
	albums.forEach(function (album) {
		shelf.append(album);
	});
	sorter.querySelectorAll('[data-sort]').forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.sort === key));
	});
}

function handleShelfClick(event) {
	const button = event.target.closest('[data-play]');
	if (!button) return;
	const album = button.closest('[data-album]');
	if (isPlaying(album)) {
		stopAll();
	} else {
		playAlbum(album);
	}
}

function handleSorterClick(event) {
	const button = event.target.closest('[data-sort]');
	if (!button) return;
	sortShelf(button.dataset.sort);
}

shelf.addEventListener('click', handleShelfClick);
sorter.addEventListener('click', handleSorterClick);
stopAllButton.addEventListener('click', stopAll);
renderState();
