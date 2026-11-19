const card = document.querySelector('.card');
const toggle = card.querySelector('.toggle');
const close = card.querySelector('.close');

function capNhatTrangThai(moRa) {
  card.classList.toggle('is-open', moRa);
  toggle.setAttribute('aria-expanded', String(moRa));
  if (moRa) {
    close.focus();
  } else {
    toggle.focus();
  }
}

toggle.addEventListener('click', function () {
  capNhatTrangThai(!card.classList.contains('is-open'));
});

close.addEventListener('click', function () {
  capNhatTrangThai(false);
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && card.classList.contains('is-open')) {
    capNhatTrangThai(false);
  }
});
