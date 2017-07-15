
class ADInputFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum{strings} */
  static get strings() {
    return strings;
  }

  /** @return enum{numbers} */
  static get numbers() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
    return {};
  }

  /** @return {!Object} */
  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string, all: boolean */) => {},
      registerInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      setDisplayMode: (/* mode: string */) => {},
      getValue: () => /* string */ '',
      setValue: (/*value: string */) => {}
    };
  }

  /**
   * @param {A=} adapter
   */
  constructor(adapter = {}) {
    /** @protected {!A} */
    this.adapter_ =
      Object.assign(ADInputFoundation.defaultAdapter, adapter);

    this.listeners_ = {
      focus: (e) => this.focus_(e),
      blur: (e) => this.blur_(e)
    };
  }

  init() {
    this.addEventListeners_();
  }

  setViewState(state) {

  }

  getValue(){
    return this.adapter_.getValue();
  }

  setValue(value){
    if(value !== '') {
      this.adapter_.addClass(ADInputFoundation.cssClasses.SELECTED);
      this.adapter_.removeClass(ADInputFoundation.cssClasses.SELECTED);
    }
    this.adapter_.setValue(value);
    this.adapter_.triggerChange(value);
  }

  destroy() {
    // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
  }

  addEventListeners_(){
    Object.keys(this.listeners_).forEach((k) => {
      this.adapter_.registerInteractionHandler(k, this.listeners_[k]);
    });
  }

  focus_(e){
    this.adapter_.addClass(ADInputFoundation.cssClasses.SELECTED);
  }

  blur_(e){
    let value = this.getValue();
    let all = value === '';
    this.adapter_.removeClass(ADInputFoundation.cssClasses.SELECTED, all);
  }
};
