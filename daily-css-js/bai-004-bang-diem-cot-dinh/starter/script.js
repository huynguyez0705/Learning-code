const table = document.querySelector('[data-table]');
const scroll = table.querySelector('[data-scroll]');
const text = document.querySelector('[data-status]')
const rows = document.querySelectorAll('[data-row]')
const btnPin = document.querySelector('[data-pin]');
let currentRow = null
const isPin = (isPinned) => {
  table.toggleAttribute('data-pinned', isPinned)
  btnPin.setAttribute('aria-pressed', String(isPinned));
}

const selectedRow = (row) => {
  if (currentRow !== null && currentRow !== row) {
    currentRow.removeAttribute('data-selected')
    currentRow.querySelector('[data-select]').setAttribute('aria-pressed', 'false')
  }
  const isRow = row.toggleAttribute('data-selected')
  currentRow = isRow ? row : null
  if (isRow) {
    text.textContent = `Đang chọn: ${row.querySelector('[data-select]').textContent.trim()}`
  } else {
    text.textContent = 'Chưa chọn học sinh nào'
  }
  row.querySelector('[data-select]').setAttribute('aria-pressed', String(isRow))
}
rows.forEach((e) => {
  e.addEventListener('click', () => {
    selectedRow(e)
  })
})
btnPin.addEventListener('click', (btn) => {
  btn.preventDefault()
  const btnPinned = btnPin.getAttribute('aria-pressed') === 'true';
  isPin(!btnPinned);
})
scroll.addEventListener('scroll', () => {
  table.toggleAttribute('data-scrolled', scroll.scrollLeft > 0);
});
