const storageKey = 'bai-022-yeu-thich';
const searchDelay = 300;
const tagNames = { 'an-sang': 'Ăn sáng', 'mon-chinh': 'Món chính', 'trang-mieng': 'Tráng miệng' };
const recipes = [
	{ id: 1, name: 'Trứng ốp la bơ tỏi', tag: 'an-sang', minutes: 10, ingredients: ['2 quả trứng', '1 thìa bơ', '1 tép tỏi'] },
	{ id: 2, name: 'Cháo yến mạch chuối', tag: 'an-sang', minutes: 15, ingredients: ['50 g yến mạch', '1 quả chuối', '200 ml sữa'] },
	{ id: 3, name: 'Bánh mì nướng phô mai', tag: 'an-sang', minutes: 8, ingredients: ['2 lát bánh mì', '2 lát phô mai'] },
	{ id: 4, name: 'Gà xào sả ớt', tag: 'mon-chinh', minutes: 30, ingredients: ['300 g đùi gà', '2 cây sả', '2 quả ớt'] },
	{ id: 5, name: 'Cá kho tộ', tag: 'mon-chinh', minutes: 45, ingredients: ['400 g cá', 'nước màu', 'tiêu xay'] },
	{ id: 6, name: 'Canh chua cá', tag: 'mon-chinh', minutes: 35, ingredients: ['300 g cá', '2 quả cà chua', 'rau thơm'] },
	{ id: 7, name: 'Chè đậu xanh', tag: 'trang-mieng', minutes: 40, ingredients: ['150 g đậu xanh', '100 g đường', 'nước cốt dừa'] },
	{ id: 8, name: 'Sữa chua trái cây', tag: 'trang-mieng', minutes: 10, ingredients: ['1 hũ sữa chua', 'xoài', 'dâu tây'] },
];
const app = document.querySelector('[data-app]');
const searchInput = document.querySelector('[data-search]');
const list = document.querySelector('[data-list]');
const empty = document.querySelector('[data-empty]');
const summary = document.querySelector('[data-status]');
const favCount = document.querySelector('[data-fav-count]');
const favFilter = document.querySelector('[data-only-favorites]');
const chips = Array.from(document.querySelectorAll('[data-tag]'));
const template = document.querySelector('[data-recipe-template]');
let searchTimer = 0;

function loadFavorites() {
	const saved = localStorage.getItem(storageKey);
	return saved === null ? [] : JSON.parse(saved);
}

const state = { query: '', tag: 'all', onlyFavorites: false, favorites: loadFavorites(), selectedId: null, renders: 0 };

function normalize(text) {
	return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
}

function getVisible() {
	return recipes.filter(function (recipe) {
		const matchTag = state.tag === 'all' || recipe.tag === state.tag;
		const matchQuery = normalize(recipe.name).includes(state.query);
		const matchFavorite = !state.onlyFavorites || state.favorites.includes(recipe.id);
		return matchTag && matchQuery && matchFavorite;
	});
}

function createCard(recipe) {
	const card = template.content.firstElementChild.cloneNode(true);
	const isFavorite = state.favorites.includes(recipe.id);
	const isSelected = state.selectedId === recipe.id;
	const favButton = card.querySelector('[data-fav]');
	card.dataset.id = recipe.id;
	card.toggleAttribute('data-selected', isSelected);
	card.querySelector('[data-name]').textContent = recipe.name;
	card.querySelector('[data-open]').setAttribute('aria-expanded', String(isSelected));
	card.querySelector('[data-meta]').textContent = `${tagNames[recipe.tag]} · ${recipe.minutes} phút`;
	card.querySelector('[data-details]').textContent = `Nguyên liệu: ${recipe.ingredients.join(', ')}.`;
	favButton.setAttribute('aria-pressed', String(isFavorite));
	favButton.setAttribute('aria-label', `Yêu thích ${recipe.name}`);
	favButton.textContent = isFavorite ? '♥' : '♡';
	return card;
}

function render() {
	const items = getVisible();
	state.renders += 1;
	list.replaceChildren(...items.map(createCard));
	empty.hidden = items.length > 0;
	summary.textContent = `Hiện ${items.length} món · đã vẽ lại ${state.renders} lần`;
	favCount.textContent = state.favorites.length;
	favCount.hidden = state.favorites.length === 0;
	favFilter.setAttribute('aria-pressed', String(state.onlyFavorites));
	chips.forEach(function (chip) {
		chip.setAttribute('aria-pressed', String(chip.dataset.tag === state.tag));
	});
}

function focusInCard(id, selector) {
	const target = list.querySelector(`[data-id="${id}"] ${selector}`);
	if (target !== null) {
		target.focus();
	}
}

function toggleFavorite(id) {
	if (state.favorites.includes(id)) {
		state.favorites = state.favorites.filter(function (item) {
			return item !== id;
		});
	} else {
		state.favorites.push(id);
	}
	localStorage.setItem(storageKey, JSON.stringify(state.favorites));
	render();
	focusInCard(id, '[data-fav]');
}

function toggleSelected(id) {
	state.selectedId = state.selectedId === id ? null : id;
	render();
	focusInCard(id, '[data-open]');
}

function handleClick(event) {
	const fav = event.target.closest('[data-fav]');
	const open = event.target.closest('[data-open]');
	const chip = event.target.closest('[data-tag]');
	if (fav !== null) {
		toggleFavorite(Number(fav.closest('[data-card]').dataset.id));
	} else if (open !== null) {
		toggleSelected(Number(open.closest('[data-card]').dataset.id));
	} else if (chip !== null) {
		state.tag = chip.dataset.tag;
		render();
	} else if (event.target.closest('[data-only-favorites]') !== null) {
		state.onlyFavorites = !state.onlyFavorites;
		render();
	}
}

function applySearch() {
	state.query = normalize(searchInput.value.trim());
	render();
}

function handleSearchInput() {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(applySearch, searchDelay);
}

app.addEventListener('click', handleClick);
searchInput.addEventListener('input', handleSearchInput);

render();
