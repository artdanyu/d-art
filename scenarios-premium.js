(() => {
  const root = document.querySelector('#scenarios');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role=tab]')];
  const panels = [...root.querySelectorAll('[role=tabpanel]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let transitions = [];
  const select = index => {
    if (index === active) return;
    active = index;
    transitions.forEach(animation => animation.cancel());
    transitions = [];
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].getAnimations().forEach(animation => animation.cancel());
      panels[i].hidden = i !== index;
    });
    if (!reduced.matches) {
      panels[index].querySelectorAll('.scenario-story').forEach(element => {
        transitions.push(element.animate([
          {opacity:0,transform:'translateY(6px)'},
          {opacity:1,transform:'translateY(0)'}
        ], {duration:320,easing:'ease-out'}));
      });
    }
  };
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
      if (event.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length-1;
      if (next === undefined) return;
      event.preventDefault(); select(next); tabs[next].focus();
    });
  });
  reduced.addEventListener('change',() => {
    if (reduced.matches) transitions.forEach(animation=>animation.cancel());
  });
})();
