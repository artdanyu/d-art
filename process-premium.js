(() => {
  const panel = document.querySelector('[data-process-panel]');
  if (!panel) return;
  const tabs = [...panel.querySelectorAll('[role="tab"]')];
  const slides = [...panel.querySelectorAll('[role="tabpanel"]')];
  const pause = panel.querySelector('.process-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const horizontal = matchMedia('(max-width: 800px)');
  const orient = () => panel.querySelector('[role="tablist"]').setAttribute('aria-orientation', horizontal.matches ? 'horizontal' : 'vertical');
  horizontal.addEventListener('change', orient);
  orient();
  let active = 0, elapsed = 0, last = 0, frame = 0;
  let visible = false, hovered = false, stopped = reduced.matches;
  const canRun = () => visible && !hovered && !stopped && !document.hidden && !reduced.matches;
  function choose(index, manual = false) {
    active = (index + tabs.length) % tabs.length;
    elapsed = 0; last = 0;
    panel.style.setProperty('--process-progress', 0);
    tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i===active)); tab.tabIndex=i===active?0:-1; slides[i].hidden=i!==active; });
    if (!reduced.matches && visible) {
      const copy = slides[active].querySelector('.process-copy');
      const art = slides[active].querySelector('.process-art img');
      [copy, art].forEach(el => el.getAnimations().forEach(a => a.cancel()));
      // Fading the slide isolates its multiply image against white during the transition.
      // Fade only the copy; move the artwork without changing its compositing opacity.
      copy.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'ease-out'});
      art.animate([{transform:'translateY(7px)'},{transform:'translateY(0)'}],{duration:420,easing:'ease-out'});
    }
    if(manual) sync();
  }
  function tick(now) {
    if(!canRun()) { sync(); return; }
    if(last) elapsed += now-last;
    last=now;
    if(elapsed>=6000) { choose(active+1); last=now; }
    panel.style.setProperty('--process-progress',Math.min(elapsed/6000,1));
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame=0; last=0;
    panel.dataset.running=String(canRun());
    if (!visible || document.hidden) slides.forEach(slide => slide.querySelectorAll('.process-copy, .process-art img').forEach(el => el.getAnimations().filter(animation => !animation.animationName).forEach(animation => animation.cancel())));
    if(canRun())frame=requestAnimationFrame(tick);
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>choose(i,true));
    tab.addEventListener('keydown',event=>{
      let next;
      if(['ArrowDown','ArrowRight'].includes(event.key))next=(i+1)%tabs.length;
      if(['ArrowUp','ArrowLeft'].includes(event.key))next=(i+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();choose(next,true);tabs[next].focus();}
    });
  });
  const updatePause=()=>{pause.textContent=stopped?'Продолжить цикл':'Приостановить цикл';pause.setAttribute('aria-pressed',String(stopped));pause.hidden=reduced.matches;};
  pause.addEventListener('click',()=>{stopped=!stopped;updatePause();sync();});
  panel.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;sync();}});
  panel.addEventListener('pointerleave',()=>{hovered=false;sync();});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{stopped=reduced.matches;updatePause();sync();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(panel);
  updatePause();sync();
})();
