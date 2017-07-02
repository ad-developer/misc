/* ========================================================================
 * uploader.js
 * Simple file upload coltrol
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

/*
  Constructor settings:
    enable: {
      dnd: true, // enable drag and drop
      add: true, // enable add first and then upload... upload is default
    }

  Public methods:
    getFormData
    getFileList
    *removeFileHandler
    setFileList

  Events:
    change
*/

const cssClasses = {

};

const attributes = {
  ATR_ADD: 'ad-uploader-add',
  ATR_UPLOAD: 'ad-uploader-upload',
  ATR_DEL: 'ad-uploader-del',
  ATR_UPL_CTR: 'ad-uploader-control'
};

class ADUploader {
  static attachTo(root, opt) {
    let instance = new ADUploader(root, opt);
    // attach instance to the root
    root.ad = root.ad || {};
    root.ad['addnd'] = instance;
    return instance;
  }
  static getInstance(root) {
    return root.ad && root.ad['aduploader'] ? root.ad['aduploader'] : null;
  }
  constructor(root, opt = {}) {
    this.root_ = root;
    this.opt_ = opt;

    this.listenerInfos_ = [
      {re:'uploadClick', ev:'click', ctr: attributes.ATR_UPLOAD},
      {re:'change', ev:'change', ctr: 'root'},
      {re:'deleteFile', ev:'click', ctr: attributes.ATR_DEL},
    ];
    this.listeners_ = {
      uploadClick: (e) => this.uploadBtnClick_(e),
      change: (e) => this.uploaderChange_(e),
      deleteFile:(e) => this.deleteFile_(e),
    };
    if(opt.add){
      this.listeners_.addClick = (e) => this.addClick_(e);
      this.listenerInfos_.push({re:'addClick', ev:'click', ctr: attributes.ATR_ADD});
    }
    this.initialize();
  }
  initialize() {
    this.activate();
  }
  activate() {
    this.addEventListeners_();
  }
  addEventListeners_(){
    [].forEach.call(this.listenerInfos_,(info)=>{
      if(info['ctr'] === 'root'){
        this.listen(info['ev'], this.listeners_[info['re']]);
      } else {
        this.listenChild(info['ctr'], info['ev'], this.listeners_[info['re']])
      }
    });
  }
  listen(evtType, handler) {
    this.root_.addEventListener(evtType, handler);
  }
  listenChild(child, entType, handler) {
    // Attributes used as a selector
    let el = this.root_.querySelector(`[${child}]`);
    el.addEventListener(entType, handler);
  }
  getFormData(){

  }
  getFileList(){

  }
  setFileList(){

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

  // Event handlers
  uploadBtnClick_(e) {

  }
  uploaderChange_(e) {

  }
  deleteFile_(e) {

  }
  addClick_(e) {
    document.querySelector(`[${attributes.ATR_UPL_CTR}]`).click();
  }
}
