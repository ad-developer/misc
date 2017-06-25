/* ========================================================================
 * checkbox.js
 * ========================================================================
 * Copyright 2017 A. D.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


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
/*
  Checkbox has three states [ check | uncheck | partial ]
  Partial state can be only triggered form setState method.
  Checkbox triggers change even and passes the triggers state along with
  the detail information.
*/
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
