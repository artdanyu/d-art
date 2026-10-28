/* Only layout changes update the canvas. No scroll loop, blur animation or raster assets. */
(() => {
  const main = document.querySelector('.page-landing main');
  const canvas = main?.querySelector('.ambient-space');
  if (!canvas) return;
  const sections = [...main.children].filter(el => el.tagName === 'SECTION');
  const keys = { direction: 'direction', 'ai-speed': 'speed', work: 'work', faq: 'faq', cta: 'cta' };
  let frame;
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      sections.forEach(section => {
        if (section.id === 'hero') canvas.style.setProperty('--hero-height', `${section.offsetHeight}px`);
        if (keys[section.id]) canvas.style.setProperty(`--${keys[section.id]}-y`, `${section.offsetTop + section.offsetHeight * .5}px`);
      });
    });
  };
  const observer = new ResizeObserver(update);
  sections.forEach(section => observer.observe(section));
  update();
})();
