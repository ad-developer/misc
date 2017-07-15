// checkbox.js
/*let cb = document.querySelectorAll('[ad-checkbox]');
for (let i = 0; i < cb.length; i++) {
  cb[i].addEventListener('click', function(e){
    this.classList.add('hide');
    let el = this.parentElement.querySelector('[ad-hidden]');
    el.classList.remove('hide');
    el.removeAttribute('ad-hidden');
    this.setAttribute('ad-hidden', true);
  });
};*/

/*util.on(document,'click','[ad-checkbox]', function(){
  this.classList.add('hide');
  let el = this.parentElement.querySelector('[ad-hidden]');
  el.classList.remove('hide');
  el.removeAttribute('ad-hidden');
  this.setAttribute('ad-hidden', true);
});
*/

const checkboxStrings = {
  CHECK_BOX_KEY: 'adcheckbox'
};
const checkboxCssClasses = {
  HIDE: 'hide',
};
const checkboxAttributes = {
  AD_HIDE: 'ad-hide',
  AD_SHOW: 'ad-show',
  AD_STATE: 'ad-state',
};

class Checkbox {
  static attachTo(root, opt) {
    let instance = new Checkbox(root, opt);
    // attach instance to the root
    root.ad = root.ad || {};
    root.ad[checkboxStrings.CHECK_BOX_KEY] = instance;
    return instance;
  }
  static attachToMany(selector, opt) {
    let list = document.querySelectorAll(selector);
    list.forEach(function(root){
      let instance = new Checkbox(root, opt);
      // attach instance to the root
      root.ad = root.ad || {};
      root.ad[checkboxStrings.CHECK_BOX_KEY] = instance;
    })
  }
  static getInstance(root) {
    return root.ad && root.ad[checkboxStrings.CHECK_BOX_KEY] ? root.ad[checkboxStrings.CHECK_BOX_KEY] : null;
  }
  constructor(root) {
    this.root_ = root;
    this.listeners_ = {
      click: (e) => this.click_(e),
    };
    this.initialize();
  }
  initialize() {
    this.addEventListeners_();
  }
  addEventListeners_() {
    Object.keys(this.listeners_).forEach((k) => {
      this.root_.addEventListener(k, this.listeners_[k]);
    });
  }
  setState(state) {
    let states = ['ckeck','unckeck','partial'];
    if(states.includes(state)){
      let root = this.root_;
      let shownEl = root.querySelector(`[${checkboxAttributes.AD_SHOW}]`)
      let curSt =  shownEl.getAttribute(checkboxAttributes.AD_STATE);
      if(curSt !== state){
        shownEl.classList.add(checkboxCssClasses.HIDE);
        shownEl.removeAttribute(checkboxAttributes.AD_SHOW);
        shownEl.setAttribute(checkboxAttributes.AD_HIDE, true);
        shownEl = root.querySelector(`[${checkboxAttributes.AD_STATE}='${state}']`);
        shownEl.classList.remove(checkboxCssClasses.HIDE);
        shownEl.setAttribute(checkboxAttributes.AD_SHOW, true);
        this.emit('change',state);
      }
    }
  }
  emit(evtType, evtData, shouldBubble = false) {
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

   this.root_.dispatchEvent(evt);
  }
  click_(e) {
    // The partial state only triggered from
    // the setState function.
    // -------------------------
    // if partial then check
    // if check then uncheck
    // if uncheck then check
    // -------------------------
    let root = this.root_;
    let shownEl = root.querySelector(`[${checkboxAttributes.AD_SHOW}]`)
    let curSt =  shownEl.getAttribute(checkboxAttributes.AD_STATE);
    let triggeredState = 'uncheck';

    shownEl.classList.add(checkboxCssClasses.HIDE);
    shownEl.removeAttribute(checkboxAttributes.AD_SHOW);
    shownEl.setAttribute(checkboxAttributes.AD_HIDE, true);

    if(curSt === 'partial' || curSt === 'uncheck'){
      shownEl = root.querySelector(`[${checkboxAttributes.AD_STATE}='check']`);
      triggeredState = 'check';
    } else {
      shownEl = root.querySelector(`[${checkboxAttributes.AD_STATE}='uncheck']`);
    }
    shownEl.classList.remove(checkboxCssClasses.HIDE);
    shownEl.setAttribute(checkboxAttributes.AD_SHOW, true);

    // Fire change event on the root.
    this.emit('change', triggeredState);
  }
}
