if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

+function(){

  let util = {};
  util.closest = function(el, sel)  {
    while(el) {
      if (el.matches(sel)) {
          return el;
      }
      el = el.parentElement;
    }
  };
  util.emit = function(el, evtType, evtData, shouldBubble) {
   let evt;
   if (typeof CustomEvent === 'function') {
     evt = new CustomEvent(evtType, {
       detail: evtData,
       bubbles: shouldBubble,
     });
   } else {
     evt = document.createEvent('CustomEvent');
     evt.initCustomEvent(evtType, shouldBubble, false, evtData);
   }

   el.dispatchEvent(evt);
  };
  util.addRemoveClasses_ = function(e){
    var cl = 'selected'
        lstCtrls = ['ad-label', 'ad-line']
        el = e.currentTarget,
        par = util.closest(el, '.control-group');
    par.querySelector('[ad-line]')
    .classList.remove(cl);

    [].forEach.call(lstCtrls, function(atr){
      par.querySelector('[' + atr + ']')
      .classList.add(cl);
    });
    par.querySelector('[ad-select-list]')
      .style.display = 'block';

  };
  util.selectItem_ = function(e) {
    let p = util.closest(this, '[ad-control-group]');
    let val = this.getAttribute('ad-value');
    let txt = this.getAttribute('ad-text');

    p.querySelector('[ad-line]').classList.remove('selected');

    p = p.querySelector('[ad-select]');
    p.textContent = txt;
    p.setAttribute('ad-value', val);
    p.setAttribute('ad-text', txt);

    util.closest(this, '[ad-select-list]')
      .style.display = 'none';

    util.emit(p, 'change');
  };
  util.setSelect = function(sel, sel_list){
    let els = document.querySelectorAll(sel),
        i = 0,
        el;
    for (; i < els.length; i++) {
      el = els[i];
      // add focus event
      el.addEventListener('click', function(e){
        util.addRemoveClasses_(e);
      });
    }

    let selctItems = document.querySelectorAll(sel_list);
    [].forEach.call(selctItems, function(item){
      item.addEventListener('click', function(e) {
        util.selectItem_.call(this, e);
      });
    });

  };
  // register all coltrols
  // on the page
  util.setSelect('[ad-select]', '[ad-select-list] li');
  // Close any opend
  // drop down list
  document.addEventListener('click', function(e){
    let el = e.target;
    let con = util.closest(el, '[ad-control-group]');
    let lists = document.querySelectorAll('[ad-select-list]');
    [].forEach.call(lists, function(lst){
      let lcon = util.closest(lst, '[ad-control-group]');
      if(con !== lcon) {
        lst.style.display = 'none';
        let ln = lcon.querySelector('[ad-line]');
        ln && ln.classList.remove('selected');

        let ctr = lcon.querySelector('[ad-select]');
        if(!ctr.getAttribute('ad-value')) {
            let lbl = lcon.querySelector('[ad-label]');
            lbl.classList.remove('selected');
        }
      }
    });
  });
}();
