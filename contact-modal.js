(() => {
  const dialog = document.getElementById('contact-modal');
  if (!dialog) return;
  let opener;
  document.querySelectorAll('[data-cw-start]').forEach(button => {
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.addEventListener('click', () => {
      opener = button;
      dialog.showModal();
      document.body.classList.add('contact-modal-open');
    });
  });
  dialog.querySelector('[data-contact-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('contact-modal-open');
    const fallback = document.getElementById('nav-toggle');
    if (opener?.getClientRects().length) opener.focus();
    else fallback?.focus();
  });
})();
