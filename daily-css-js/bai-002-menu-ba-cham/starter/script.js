const dataCard = document.querySelectorAll("[data-card]")
const setOpen = (article, isOpen) => {
  article.toggleAttribute("data-open", isOpen);
  article.querySelector("[data-menu-button]").setAttribute('aria-expanded', isOpen)
  if (isOpen) {
    article.querySelector("[data-menu] button").focus();
  }
};
const closeOpen = (card) => {
  card.toggleAttribute("data-open", false);
  card.querySelector("[data-menu-button]").setAttribute('aria-expanded', false)

}
dataCard.forEach(card => {
  card.querySelector("[data-menu-button]").addEventListener('click', (e) => {
    const dataMenuBtn = e.currentTarget
    const isOpen = dataMenuBtn.getAttribute("aria-expanded") === "true";
    setOpen(card, !isOpen);
    dataCard.forEach(other => {
      if (card !== other) {
        closeOpen(other)
      }
    })
  })
  card.querySelector('.danger').onclick = () => {
    closeOpen(card)
  }

})

document.addEventListener('keydown', function (event) {
  if (event.key !== 'Escape') {
    return;
  }
  const openCard = document.querySelector('[data-card][data-open]');
  if (openCard) {
    closeOpen(openCard, false);
    openCard.querySelector('[data-menu-button]').focus();
  }
});
document.addEventListener("click", function (e) {
  if (!e.target.closest("[data-open]")) {
    dataCard.forEach(closeOpen);
  }
});