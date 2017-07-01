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
const checkboxAttributes = {
  AD_SHOW: 'ad-show',
  AD_STATE: 'ad-state',
};
/*
  Checkbox has three states [ check | uncheck | partial ]
  Partial state can be only triggered form setState method.
  Checkbox triggers the change event and passes the triggered state along with
  the detail information.
*/
class ADCheckbox {
  static attachTo(root, opt) {
    let instance = new ADCheckbox(root, opt);
    // attach instance to the root
    root.ad = root.ad || {};
    root.ad[checkboxStrings.CHECK_BOX_KEY] = instance;
    return instance;
  }
  static attachToMany(selector, opt) {
    let list = document.querySelectorAll(selector);
    list.forEach(function(root){
      let instance = new ADCheckbox(root, opt);
      // attach instance to the root
      root.ad = root.ad || {};
      root.ad[checkboxStrings.CHECK_BOX_KEY] = instance;
    })
  }
  static getInstance(root) {
    return root.ad && root.ad[checkboxStrings.CHECK_BOX_KEY] ? root.ad[checkboxStrings.CHECK_BOX_KEY] : null;
  }
  constructor(root, opt = {}) {
    this.root_ = root;
    this.opt_ = opt;
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
  setState_(state) {
    let states = ['check','uncheck','partial'];
    if(states.includes(state)){
      let root = this.root_;
      let el = root.querySelector(`[${checkboxAttributes.AD_SHOW}]`)
      let cst =  root.getAttribute(checkboxAttributes.AD_STATE);
      let disp = this.opt_.disp || 'block';
      if(cst !== state){
        el.style.display = 'none';
        el.removeAttribute(checkboxAttributes.AD_SHOW);

        el = root.querySelector(`[${checkboxAttributes.AD_STATE}='${state}']`);

        el.style.display = disp;
        el.setAttribute(checkboxAttributes.AD_SHOW, true);

        root.setAttribute(checkboxAttributes.AD_STATE, state);

        this.emit('change',state);
      }
    }
  }
  setState(state) {
    this.setState_(state);
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
    let st = this.root_.getAttribute(checkboxAttributes.AD_STATE);
    let attr = 'uncheck';

    if(st === 'partial' || st === 'uncheck'){
      attr = 'check';
    }
    this.setState_(attr);
  }
}
