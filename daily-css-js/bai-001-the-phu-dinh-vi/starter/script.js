const toggle = document.querySelector('.toggle');
const close = document.querySelector('.close');
const overlay = document.querySelector('.overlay');

const setOpen = (isOpen) => {
  overlay.classList.toggle('show', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) {
    close.focus();
  } else {
    toggle.focus();
  }
}
toggle.addEventListener('click', function () {
  setOpen(!overlay.classList.contains('show'));
});
close.addEventListener('click', function () {
  setOpen(false);
})
document.onkeydown = (event) => {
  if (event.key === 'Escape' && overlay.classList.contains('show')) {
    setOpen(false);
  }
}