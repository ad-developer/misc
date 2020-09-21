var ad = ad || {};

ad.utils = {
  createElement: function(html){
    var el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
  },
  emit: function(evtElement, evtType, evtData, shouldBubble){
    let evt;
    if(typeof CustomEvent === 'function'){
      evt = new CustomEvent(evtType, {
        detail: evtData,
        bubbles: shouldBubble
      });
    } else {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(evtType, shouldBubble, false, evtData);
    }
    evtElement.dispatchEvent(evt);
    
  }
};
