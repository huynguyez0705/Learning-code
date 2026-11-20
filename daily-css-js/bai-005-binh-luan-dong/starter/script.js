const page = document.querySelector('[data-page]');
const dialog = document.querySelector('[data-dialog]')
const form = document.querySelector('[data-form]');
const list = document.querySelector('[data-list]');
let comment = list.querySelectorAll('[data-comment]')
let count = document.querySelector('[data-count]')
const input = document.querySelector('[data-input]');
const cancel = document.querySelector('[data-cancel]');
const backdrop = document.querySelector('[data-backdrop]');
const thread = document.querySelector('[data-thread]');
const template = document.querySelector('[data-template]');
let currentComment = null;
let curentButton = null
const setDialog = (isOpen) => {
  page.toggleAttribute('inert', isOpen)
  dialog.toggleAttribute('data-open', isOpen)
}

const openDialog = (comment, button) => {
  currentComment = comment
  curentButton = button
  setDialog(true)
  document.querySelector('[data-dialog-text]').textContent = currentComment.querySelector('[data-comment-text]').textContent
  cancel.focus()
}
const closeDiaLog = () => {
  setDialog(false)
  currentComment.querySelector('[data-delete]').focus()
  currentComment = null
}

const removeComent = () => {
  currentComment.closest('li').remove();
  syncComment()
  setDialog(false)
  document.querySelector('[data-heading]').focus();
  currentComment = null
}

const syncComment = () => {
  let total = list.querySelectorAll('[data-comment]').length
  count.textContent = String(total);
  thread.toggleAttribute('data-empty', total === 0)
}

const addComment = (e) => {
  e.preventDefault()
  let text = input.value.trim()
  if (text === '' || text == null) {
    document.querySelector('[data-error]').textContent = "Hãy viết nội dung trước khi gửi.";
    input.setAttribute('aria-invalid', true)
    input.focus();
    return;
  }
  const newcomment = (template.content.cloneNode(true))
  newcomment.querySelector('[data-comment-text]').textContent = text
  form.reset()
  input.setAttribute('aria-invalid', false)
  document.querySelector('[data-error]').textContent = ''
  list.append(newcomment)
  syncComment()
  input.focus()
}
const checkComment = (e) => {
  const buttonDel = e.target.closest('[data-delete]');
  if (!buttonDel) return;

  const comment = buttonDel.closest('[data-comment]');
  if (!comment) return;

  openDialog(comment, buttonDel);
};

cancel.addEventListener('click', closeDiaLog)
backdrop.addEventListener('click', closeDiaLog)
document.addEventListener('keydown', (e) => {
  if (dialog.hasAttribute('data-open') === true && page.hasAttribute('inert') === true && e.key === "Escape")
    closeDiaLog()
})
document.querySelector('[data-confirm]').addEventListener('click', removeComent);
form.addEventListener('submit', addComment)
list.addEventListener('click', checkComment);