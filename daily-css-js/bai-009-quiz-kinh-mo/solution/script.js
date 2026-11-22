const questions = [
	{
		text: 'Thẻ HTML nào tạo liên kết sang trang khác?',
		options: ['<a>', '<link>', '<nav>', '<href>'],
		answer: 0,
		note: '<a href="..."> là thẻ liên kết; <link> dùng nạp tài nguyên như CSS.',
	},
	{
		text: 'Khai báo nào cho phép gán lại giá trị sau này?',
		options: ['const', 'let', 'function', 'import'],
		answer: 1,
		note: 'let cho gán lại; const thì không.',
	},
	{
		text: 'Thuộc tính CSS nào quyết định phần tử nào nằm trên khi chồng nhau?',
		options: ['order', 'float', 'z-index', 'inset'],
		answer: 2,
		note: 'z-index quyết định thứ tự xếp chồng của phần tử được định vị.',
	},
	{
		text: 'new FormData(form).get("answer") trả gì khi chưa chọn ô nào?',
		options: ['chuỗi rỗng', '0', 'undefined', 'null'],
		answer: 3,
		note: 'FormData.get trả null khi không có trường nào mang tên đó.',
	},
];

const card = document.querySelector('[data-card]');
const counter = document.querySelector('[data-counter]');
const questionText = document.querySelector('[data-question]');
const form = document.querySelector('[data-form]');
const fieldset = document.querySelector('[data-fieldset]');
const feedback = document.querySelector('[data-feedback]');
const submit = document.querySelector('[data-submit]');
const scoreText = document.querySelector('[data-score]');
const doneTitle = document.querySelector('[data-done-title]');
const restartButton = document.querySelector('[data-restart]');
const template = document.querySelector('[data-option-template]');

let index = 0;
let score = 0;
let answered = false;

function renderQuestion() {
	const current = questions[index];
	answered = false;
	counter.textContent = `Câu ${index + 1}/${questions.length}`;
	questionText.textContent = current.text;
	feedback.textContent = '';
	submit.textContent = 'Trả lời';
	fieldset.disabled = false;
	fieldset.replaceChildren();
	current.options.forEach(function (text, optionIndex) {
		const option = template.content.cloneNode(true);
		option.querySelector('[data-option-input]').value = String(optionIndex);
		option.querySelector('[data-option-text]').textContent = text;
		fieldset.append(option);
	});
}

function markOptions(chosen, correct) {
	const options = Array.from(fieldset.querySelectorAll('[data-option]'));
	options[correct].dataset.state = 'correct';
	if (chosen !== correct) {
		options[chosen].dataset.state = 'wrong';
	}
}

function checkAnswer() {
	const value = new FormData(form).get('answer');
	if (value === null) {
		feedback.textContent = 'Hãy chọn một đáp án trước.';
		return;
	}
	const chosen = Number(value);
	const current = questions[index];
	const isCorrect = chosen === current.answer;
	if (isCorrect) {
		score += 1;
	}
	markOptions(chosen, current.answer);
	fieldset.disabled = true;
	answered = true;
	feedback.textContent = isCorrect ? 'Chính xác!' : `Chưa đúng. ${current.note}`;
	submit.textContent = index === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp';
	submit.focus();
}

function showDone() {
	scoreText.textContent = `Bạn đúng ${score}/${questions.length} câu`;
	card.toggleAttribute('data-done', true);
	doneTitle.focus();
}

function nextQuestion() {
	index += 1;
	if (index === questions.length) {
		showDone();
		return;
	}
	renderQuestion();
	questionText.focus();
}

function handleSubmit(event) {
	event.preventDefault();
	if (answered) {
		nextQuestion();
	} else {
		checkAnswer();
	}
}

function restart() {
	index = 0;
	score = 0;
	card.toggleAttribute('data-done', false);
	renderQuestion();
	questionText.focus();
}

form.addEventListener('submit', handleSubmit);
restartButton.addEventListener('click', restart);
renderQuestion();
