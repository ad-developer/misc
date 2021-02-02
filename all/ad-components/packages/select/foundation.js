
class ADSelectFoundation {
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

      setAttr: (/* attr: string, value: string */) => {},
      rmAttr: (/* attr: string */) => {},

      registerInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evtType: string, handler: EventListener */) => {},

      registerMenuInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterMenuInteractionHandler: (/* type: string, handler: EventListener */) => {},

      getValue: () => /* string */ '',
      setValue: (/* value: string */) => {},

      setDisplayMode: (/* mode: string */) => {},
      notifyChange: () => {},

      isMenuOpen: () => /* boolean */ false
    };
  }

  /**
   * @param {A=} adapter
   */
  constructor(adapter = {}) {
    /** @protected {!A} */
    this.adapter_ =
      Object.assign(ADInputFoundation.defaultAdapter, adapter);

      this.displayHandler_ = (evt) => {
        evt.preventDefault();
        if (!this.adapter_.isMenuOpen()) {
          this.open_();
        }
      };
      this.selectionHandler_ = ({detail}) => {
        const {index} = detail;
        this.close_();
        if (index !== this.selectedIndex_) {
          this.setSelectedIndex(index);
          this.adapter_.notifyChange();
        }
      };

  }

  init() {
    this.adapter_.registerInteractionHandler('click', this.displayHandler_);
    this.adapter_.registerMenuInteractionHandler(
      ADSelectFoundation.strings.SELECTED_EV, this.selectionHandler_);
  }

  destroy() {
    // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
  }

  getValue(){
    return this.adapter_.getValue();
  }

  setValue(value){
    let all = true;
    if(value !== '') {
      this.adapter_.addClass(ADInputFoundation.cssClasses.SELECTED);
      all = false;
    }
    this.adapter_.removeClass(ADInputFoundation.cssClasses.SELECTED, all);
    this.adapter_.setValue(value);
    this.adapter_.triggerChange(value);
  }

  setViewState(state) {
    this.removeEventListeners_();
    this.adapter_.setViewState(state);
    if(state === 'edit') {
      this.addEventListeners_();
    }
  }

  addEventListeners_(){
    Object.keys(this.listeners_).forEach((k) => {
      this.adapter_.registerInteractionHandler(k, this.listeners_[k]);
    });
  }

  removeEventListeners_() {
    Object.keys(this.listeners_).forEach((k) => {
      this.adapter_.deregisterInteractionHandler(k, this.listeners_[k]);
    });
  }

  focus_(e){
    this.adapter_.addClass(ADInputFoundation.cssClasses.SELECTED);
  }

  blur_(e){
    let value = this.getValue();
    let all = value === '';
    this.adapter_.triggerChange(value);
    this.adapter_.removeClass(ADInputFoundation.cssClasses.SELECTED, all);
  }
};
