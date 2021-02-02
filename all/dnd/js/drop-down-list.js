// drop-down-list.js
let sel = document.querySelectorAll('[ad-select]');
for (let i = 0, list; i < sel.length; i++) {
  sel[i].addEventListener('click', function(e){
    list = this.querySelector('[ad-select-options]');
    list.classList.add('show')
    list.setAttribute('ad-select-options-shown', true);
  });
}
let selOpts = document.querySelectorAll('[ad-select-option]');

for (let i = 0; i < selOpts.length; i++) {
    selOpts[i].addEventListener('click', function(e){
      let ctrl,
          list,
          inpt,
          val,
          text,
          texAtr = 'ad-text',
          valAtr = 'ad-val',
          ev;
      ctrl = util.closest(this, '[ad-select]');


      val = this.getAttribute(valAtr);
      text = this.getAttribute(texAtr);

      ctrl.setAttribute(texAtr, text);
      ctrl.setAttribute(valAtr, val);

      inpt = ctrl.querySelector('[ad-select-control]');
      inpt.textContent = text;


      list = util.closest(this, '[ad-select-options]');
      list.classList.remove('show');
      list.setAttribute('ad-select-options-shown', false);

      // Fire change event
      ev = document.createEvent('Event');
      ev.initEvent('change', true, true);
      ctrl.dispatchEvent(ev);

      e.stopPropagation();

  });

}
document.addEventListener('click', function(e){
  let contr = util.closest(e.target, '[ad-select]');
  let selected = contr ? contr.querySelector('[ad-select-options-shown=true]') : null;
  let opts = document.querySelectorAll('[ad-select-options-shown=true]');

  for (let i = 0, opt; i < opts.length; i++) {
    opt = opts[i];
    if(selected != opt){
      opt.classList.remove('show');
      opt.setAttribute('ad-select-options-shown', false);
    }
  }

});
