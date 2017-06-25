// util.js

const util = {
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
  },
  insertAfter: function(newNode, referenceNode) {
    let el = document.createElement('div');
    el.innerHTML = newNode;
    newNode = el.firstChild;
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  },
  // Event deligation...
  // https://stackoverflow.com/questions/30880757/javascript-equivalent-to-on
  on: function(el, evt, sel, handler) {
    el.addEventListener(evt, function(event) {
        let t = event.target;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, event);
            }
            t = t.parentNode;
        }
    });
  }
};
