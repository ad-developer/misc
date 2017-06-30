// util.js

const util = {
  el: function(id) {
    return document.getElementById(id);
  },
  closest: function(el, sel)  {
    while(el) {
      if (el.matches(sel)) {
          return el;
      }
      el = el.parentElement;
    }
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
