const dPage = document.querySelector('[data-page]');
const heading = document.querySelector('[data-heading]');
let dCount = dPage.querySelector('[data-count]');
const dCard = dPage.querySelectorAll('[data-card]');
const dDialog = document.querySelector('[data-dialog]');
const dDialogName = dDialog.querySelector('[data-dialog-name]');
const dConfirmButton = dDialog.querySelector('[data-dialog-confirm]');
const dCancelButton = dDialog.querySelector('[data-dialog-cancel]');
const dBackdrop = dDialog.querySelector('[data-dialog-backdrop]');
let currentCard = null;

function setDialog(isOpen) {
  dPage.toggleAttribute('inert', isOpen);
  dDialog.toggleAttribute('data-open', isOpen);
}

function openDialog(card) {
  currentCard = card;
  dDialogName.textContent = currentCard.querySelector('[data-card-name]').textContent;
  setDialog(true);
  dCancelButton.focus();
}
function closeDialog() {
  setDialog(false)
  currentCard.querySelector('[data-delete]').focus();
  currentCard = null
}

function removeDialog() {
  currentCard.closest('li').remove();
  dCount.textContent = document.querySelectorAll('[data-card]').length;
  setDialog(false);
  heading.focus();
  currentCard = null;
}

dConfirmButton.addEventListener('click', removeDialog);

dCard.forEach(function (item) {
  item.querySelector('[data-delete]').addEventListener('click', function () {
    openDialog(item);
  });
});
dCancelButton.addEventListener('click', closeDialog);
dBackdrop.addEventListener('click', closeDialog);
document.addEventListener('keydown', e => {
  if (e.key === "Escape" && dDialog.hasAttribute('data-open') === true)
    closeDialog()
})
dConfirmButton.addEventListener('click', removeDialog)