/* ========================================================================
 * uploader.js
 * Simple file uploader coltrol.
 * ========================================================================
 * Copyright 2017 A. D. All Rights Reserved.
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

/*
  Constructor settings:
    dnd: true, // enable drag and drop
    add: true, // enable add first and then upload... upload is default
    url: upload url, if provided then internal upload process will be performed

  Public methods:
    getFormData
    getFileList
    *removeFileHandler
    setFileList

  Root events:
    change
    upload
*/

const util = {
  closest(el, sel)  {
    while(el) {
      if (el.matches(sel)) {
          return el;
      }
      el = el.parentElement;
    }
  },
  $(query) {
    return document.querySelector(query);
  }
};

const cssClasses = {
  BLNK: 'ad-uploader-blink',
  PRG_RUN: 'ad-progress-run'
};

const strings = {
  // Instanc ekey
  INSTANCE_KEY: 'ad-uploader',
  // Events
  EV_CHANGE: 'change',
  EV_UPLOAD: 'upload',
  EV_CLICK: 'click',
  // Messages
  CONF: 'Confirm file deletion.',
  // Attributes
  ADD: 'ad-uploader-add',
  UPLOAD: 'ad-uploader-upload',
  DEL: 'ad-uploader-del',
  LIST: 'ad-uploader-list',
  ITEM: 'ad-uploader-item',
  ITEM_LINK: 'ad-item-link',
  ITEM_DEL: 'ad-item-delete',
  ITEM_DEL_CONF: 'ad-item-conf',
  TTL: 'title',
  FILE_NAME: 'ad-item-file-name',
  FILE_ID: 'ad-item-file-id',
  PROGRESS: 'ad-uploader-progress',
  RUNNER: 'ad-progress'
};

class ADFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    // Classes extending MDCFoundation should implement this method to return an object which exports every
    // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
    return {};
  }

  /** @return enum{strings} */
  static get strings() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
    return {};
  }

  /** @return enum{numbers} */
  static get numbers() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
    return {};
  }

  /** @return {!Object} */
  static get defaultAdapter() {
    // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
    // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
    // validation.
    return {};
  }

  /**
   * @param {A=} adapter
   */
  constructor(adapter = {}) {
    /** @protected {!A} */
    this.adapter_ = adapter;
  }

  init() {
    // Subclasses should override this method to perform initialization routines (registering events, etc.)
  }

  destroy() {
    // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
  }
}

class ADComponent {
  /**
   * @param {!Element} root
   * @return {!ADComponent}
   */
  static attachTo(root) {
    // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element. Also note that in the cases of
    // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
    // from getDefaultFoundation().

    let instance = new ADComponent(root, new ADFoundation());
    // Attach instance to the root
    root.ad = root.ad || {};
    root.ad[ADFoundation.strings.INSTANCE_KEY] = instance;
    return instance;
  }

  /**
   * @param {!Element} root
   * @return {!MDCComponent}
   */
  static getInstance(root){
    return root.ad && root.ad[ADFoundation.strings.INSTANCE_KEY]
      ? root.ad[ADFoundation.strings.INSTANCE_KEY] : null;
  }

  /**
   * @param {!Element} root
   * @param {F=} foundation
   * @param {...?} args
   */
  constructor(root, foundation = undefined, ...args) {
    /** @protected {!Element} */
    this.root_ = root;
    this.initialize(...args);
    // Note that we initialize foundation here and not within the constructor's default param so that
    // this.root_ is defined and can be used within the foundation class.
    /** @protected {!F} */
    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;
    this.foundation_.init();
    this.initialSyncWithDOM();
  }

  initialize(/* ...args */) {
    // Subclasses can override this to do any additional setup work that would be considered part of a
    // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
    // initialized. Any additional arguments besides root and foundation will be passed in here.
  }

  /**
   * @return {!F} foundation
   */
  getDefaultFoundation() {
    // Subclasses must override this method to return a properly configured foundation class for the
    // component.
    throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' +
      'foundation class');
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
}

/* Uploader component */

class  ADUploaderFile {
  constructor() {

  }
}

class ADUploaderFoundation extends ADFoundation {
  static get strings() {
    return strings;
  }
  constructor(adapter) {
    super(Object.assign(ADUploaderFoundation.defaultAdapter, adapter));
    // Settings
    this.settings_ = this.adapter_.getSettings();

    // Uploader control
    this.ctr_ = null;

    // Uploader control handler
    this.uploadHandler_ = (e) => this.upload_(e);

    // Button handlers
    this.addBtnHandler_ = (e) => this.addBtn_(e);
    this.uploadBtnHandler_ = (e) => this.upbloadBtn_(e);
    this.deleteBtnHandler_ = (e) => this.deleteBtn_(e);
  }
  init(){
    // Create upload control
    this.ctr_ = this.adapter_.createUploadControl();
    // Register upload btn handler
    this.adapter_.registerUploadBtn(this.uploadBtnHandler_);

    // Register upload control handler
    // TODO: This is a temp solution...
    this.registerUploadCtr_(this.uploadHandler_);
  }
  getFormData(){
    let formData = new FormData(),
        i = 0,
        files = this.ctr_.files,
        file;
    for (; file = files[i]; i++) {
      formData.append('file', file, file.name);
    }
    return formData;
  }

  upload_(e){
    // TODO: Upload routine goes here...
    this.adapter_.notifyUpload();
  }
  addBtn_(){}
  upbloadBtn_(e){
    // TODO: This is a temp solution...
    // This is done on the foundation level for now.
    // It can be moved to component level and handled through the adapter.
    this.ctr_.click();
  }
  deleteBtn_(){}

  // TODO: Temp.
  registerUploadCtr_(handler){
    this.ctr_.addEventListener(ADUploaderFoundation.strings.EV_CHANGE, handler);
  }
}

class ADUploader extends ADComponent {

  static attachTo(root) {
    // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element. Also note that in the cases of
    // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
    // from getDefaultFoundation().

    let instance = new ADUploader(root);
    // Attach instance to the root
    root.ad = root.ad || {};
    root.ad[ADFoundation.strings.INSTANCE_KEY] = instance;
    return instance;
  }
  static getInstance(root){
    return root.ad && root.ad[ADUploaderFoundation.strings.INSTANCE_KEY]
      ? root.ad[ADUploaderFoundation.strings.INSTANCE_KEY] : null;
  }


  initialize(){}
  getDefaultFoundation(){
    return new ADUploaderFoundation({
      createUploadControl: () => {
        let ctrl = document.createElement('input');
        ctrl.setAttribute('type','file');
        ctrl.setAttribute('multiple','multiple');
        ctrl.style.display = 'none';
        return ctrl;
      },
      getSettings: () => {
        // Read the root attributes
        // {
        //  mode: 'add|upload',
        //  upload: true,
        //  delete: true
      },
      notifyUpload: () => this.emit(ADUploaderFoundation.strings.EV_UPLOAD, this),
      registerUploadBtn: (handler) => {
        this.root_
          .querySelector(`[${ADUploaderFoundation.strings.UPLOAD}]`)
          .addEventListener(ADUploaderFoundation.strings.EV_CLICK, handler);
      }
    });
  }

  getFormData(){
    return this.foundation_.getFormData();
  }
  getFileList(){}
  setFileList(){

  }
  removeFile(file){}

  /**
   * processIndicator - description
   *
   * @param  {boolean} stop switch to start/stop indicator
   */
  processIndicator(stop=false){
    let runner = this.root_
        .querySelector(`[${ADUploaderFoundation.strings.RUNNER}]`);
    if(stop){
      runner.classList.remove('ad-progress-run');
    } else {
      runner.classList.add('ad-progress-run');
    }
  }
  confirmIndicator(stop=false){

  }
}
