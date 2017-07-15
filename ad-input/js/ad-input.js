
const strings = {
  INPUT_KEY: 'ad-input',
  INPUT_CTR: 'ad-input',
  LABEL: 'ad-label',
  LABEL_STAR: 'ad-label-required',
  LINE: 'ad-line',
  VALUE: 'ad-value',
  CHANGE: 'change'
};

const cssClasses = {
  SELECTED: 'selected'
};

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

class ADInput {
  /**
   * @param {!Element} root
   * @return {!ADInput}
   */
  static attachTo(root, opt) {
    // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element. Also note that in the cases of
    // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
    // from getDefaultFoundation().
    return new ADInput(root, undefined, opt);
  }
  static attachToMany(selector, opt) {
    let list = document.querySelectorAll(selector);
    for (let i = 0, root, instance; (root = list[i]); i++){
      root = list[i];
      instance = new ADInput(root, undefined, opt);
      // attach instance to the root
      root.ad = root.ad || {};
      root.ad[ADInputFoundation.strings.INPUT_KEY] = instance;
    }
  }
  static getInstance(root) {
    return root.ad && root.ad[ADInputFoundation.strings.INPUT_KEY]
      ? root.ad[ADInputFoundation.strings.INPUT_KEY] : null;
  }

  get value() {
    return this.foundation_.getValue();
  }

  set value(value) {
    this.foundation_.setValue(value);
  }

  /**
   * @param {!Element} root
   * @param {F=} foundation
   * @param {Object=} opt
   */
  constructor(root, foundation = undefined, opt = {}) {
    /** @protected {!Element} */
    this.root_ = root;
    this.initialize(opt);
    // Note that we initialize foundation here and not within the constructor's default param so that
    // this.root_ is defined and can be used within the foundation class.
    /** @protected {!F} */
    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;
    this.foundation_.init();
    this.initialSyncWithDOM();
  }

  initialize(opt) {
    // Subclasses can override this to do any additional setup work that would be considered part of a
    // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
    // initialized. Any additional arguments besides root and foundation will be passed in here.
  }

  /**
   * @return {!F} foundation
   */
  getDefaultFoundation() {
    return new ADInputFoundation({
      addClass: (className) => {
        let lbl = this.root_.querySelector(`[${ADInputFoundation.strings.LABEL}]`);
        let ln = this.root_.querySelector(`[${ADInputFoundation.strings.LINE}]`);
        lbl.classList.add(className);
        ln.classList.add(className);
      },
      removeClass: (className, all = false) => {
        let ln = this.root_.querySelector(`[${ADInputFoundation.strings.LINE}]`);
        ln.classList.remove(className);
        if(all) {
          let lbl = this.root_.querySelector(`[${ADInputFoundation.strings.LABEL}]`);
          lbl.classList.remove(className);
        }
      },
      registerInteractionHandler: (evtType, handler) => {
        let ctr = this.root_.querySelector(`[${ADInputFoundation.strings.INPUT_CTR}]`);
        ctr.addEventListener(evtType, handler);
      },
      setDisplayMode: (/* mode: string */) => {},
      getValue: () => {
        let ctr = this.root_.querySelector(`[${ADInputFoundation.strings.INPUT_CTR}]`);
        return ctr.value.trim();
      },
      setValue: (value) => {
        let ctr = this.root_.querySelector(`[${ADInputFoundation.strings.INPUT_CTR}]`);
        ctr.setAttribute(ADInputFoundation.strings.VALUE, value);
        ctr.value = value;
      },
      triggerChange: (value) => {
        this.emit(ADInputFoundation.strings.CHANGE, value);
      }
    });
  }

  initialSyncWithDOM() {
    // Subclasses should override this method if they need to perform work to synchronize with a host DOM
    // object. An example of this would be a form control wrapper that needs to synchronize its internal state
    // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
    // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
  }

  destroy() {
    // Subclasses may implement this method to release any resources / deregister any listeners they have
    // attached. An example of this might be deregistering a resize event from the window object.
    this.foundation_.destroy();
  }

  /**
   * Wrapper method to add an event listener to the component's root element. This is most useful when
   * listening for custom events.
   * @param {string} evtType
   * @param {!Function} handler
   */
  listen(evtType, handler) {
    this.root_.addEventListener(evtType, handler);
  }

  /**
   * Wrapper method to remove an event listener to the component's root element. This is most useful when
   * unlistening for custom events.
   * @param {string} evtType
   * @param {!Function} handler
   */
  unlisten(evtType, handler) {
    this.root_.removeEventListener(evtType, handler);
  }

  /**
   * Fires a cross-browser-compatible custom event from the component root of the given type,
   * with the given data.
   * @param {string} evtType
   * @param {!Object} evtData
   * @param {boolean=} shouldBubble
   */
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
};

ADInput.attachToMany('[ad-input-control]');
