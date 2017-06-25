class ADCheckbox {
  static attachTo(root){
    return new ADCheckbox(root);
  }
  constructor(root) {
    this.root_ = root;
  }
  initialize(){

  }
  // checked | unchecked | indetermined
  setState(state) {

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
}
