// util.js

let util = {
  el: function(id) {
    return document.getElementById(id);
  },
  closest: function(domEl, attr)  {
    if(domEl.hasAttribute(attr)){
      return domEl;
    }
    let el = domEl.parentElement;
    let res = null;
    while (el.parentElement != null) {
      if(el.hasAttribute(attr)){
        res = el;
        break;
      }
      el = el.parentElement;
    }
    return res;
  },
  getParentOfType: function(el, type){
    if(el.nodeName === type){
      return el;
    }
    let nodeName = el.parentElement.nodeName;
    let parentElement = el.parentElement;
    while (nodeName !== type) {
      parentElement = parentElement.parentElement;
      nodeName = parentElement.nodeName;
    }
    return parentElement;
  }
};
