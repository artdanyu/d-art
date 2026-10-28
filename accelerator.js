/* Observe the existing slider's output. No duplicated calculations or timers. */
(() => {
  const section = document.querySelector('#ai-speed.accelerator');
  if (!section) return;
  const range = section.querySelector('#ai-speed-range');
  const mode = section.querySelector('#ai-speed-mode-label');
  const values = [...section.querySelectorAll('.accelerator-value')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const previous = new Map();
  const update = () => {
    range.style.setProperty('--accelerator-fill', `${range.value}%`);
    range.setAttribute('aria-valuetext', `${mode.textContent}. ${values.map(el => el.textContent).join('; ')}`);
    values.forEach(el => {
      const text = el.textContent;
      el.dataset.zero = String(text === 'без экономии');
      if (previous.has(el) && previous.get(el) !== text && !reduced.matches) {
        el.getAnimations().forEach(animation => animation.cancel());
        el.animate([{ opacity: .55, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 240, easing: 'ease-out' });
      }
      previous.set(el, text);
    });
  };
  const observer = new MutationObserver(update);
  values.forEach(el => observer.observe(el, { childList: true, characterData: true, subtree: true }));
  range.addEventListener('input', update);
  update();
})();
