(() => {
  const items = document.querySelectorAll('#benefits .benefit');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('benefit-pending');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  items.forEach(item => {
    item.classList.add('benefit-pending');
    observer.observe(item);
  });
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer.disconnect();
    items.forEach(item => item.classList.remove('benefit-pending'));
  });
})();
