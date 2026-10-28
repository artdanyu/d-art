(() => {
  const main = document.querySelector('.page-landing main');
  if (!main) return;
  const layer = document.createElement('div');
  layer.className = 'light-space';
  layer.setAttribute('aria-hidden','true');
  layer.innerHTML = '<div class="light-space__color"></div>' + ['one','two','three','four'].map((name,i) => `
    <svg class="light-space__wave light-space__wave--${name}" viewBox="0 0 1600 640" preserveAspectRatio="none" focusable="false">
      <defs>
        <linearGradient id="light-ribbon-${i}" x1="0" y1="0" x2=".9" y2="1" gradientUnits="objectBoundingBox">
          <stop stop-color="#c8e5f7" stop-opacity="0"/>
          <stop offset=".28" stop-color="#d1e6f8" stop-opacity=".65"/>
          <stop offset=".58" stop-color="#d7c9f0" stop-opacity=".38"/>
          <stop offset=".82" stop-color="#f0ddef" stop-opacity=".22"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="light-edge-${i}">
          <stop stop-color="#fff" stop-opacity="0"/>
          <stop offset=".25" stop-color="#fff" stop-opacity=".92"/>
          <stop offset=".65" stop-color="#fff" stop-opacity=".75"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <filter id="light-soft-${i}" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      <path d="M-100 480 C280 40 490 80 800 300 S1320 560 1710 110 L1710 220 C1320 640 1110 510 800 345 S280 115-100 580Z" fill="url(#light-ribbon-${i})" filter="url(#light-soft-${i})"/>
      <path d="M-100 480 C280 40 490 80 800 300 S1320 560 1710 110" fill="none" stroke="url(#light-edge-${i})" stroke-width="2"/>
      <path d="M-100 530 C280 90 490 105 800 335 S1320 600 1710 160" fill="none" stroke="#c9d4ec" stroke-opacity=".22" stroke-width="1"/>
    </svg>`).join('');
  main.prepend(layer);
  let frame;
  const update = () => {
    const base = main.getBoundingClientRect().top;
    const box = selector => {
      const node = main.querySelector(selector);
      if (!node) return {top:0,height:0};
      const rect = node.getBoundingClientRect();
      return {top:rect.top-base,height:rect.height};
    };
    const anchors = {};
    ['benefits','scenarios','direction','process','work','faq','cta'].forEach(id => {
      const rect=box('#'+id);
      anchors[id+'-top']=rect.top;
      anchors[id+'-y']=rect.top+rect.height*.45;
    });
    const work=box('#work');
    anchors['work-y']=work.top+work.height*.17;
    anchors['products-y']=work.top+work.height*.5;
    anchors['products-end-y']=work.top+work.height*.83;
    Object.entries(anchors).forEach(([name,value])=>layer.style.setProperty('--'+name,value+'px'));
  };
  const schedule = () => { cancelAnimationFrame(frame); frame=requestAnimationFrame(update); };
  update();
  // Recompute only on layout changes, never on scroll. FAQ expansion is included.
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    main.querySelectorAll(':scope > section').forEach(section=>observer.observe(section));
  }
  window.addEventListener('resize',schedule,{passive:true});
  document.fonts?.ready.then(schedule);
})();
