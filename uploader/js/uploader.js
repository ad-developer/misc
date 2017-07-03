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

const util = {
  closest(el, sel)  {
    while(el) {
      if (el.matches(sel)) {
          return el;
      }
      el = el.parentElement;
    }
  }
};

const cssClasses = {
  BLNK: 'ad-uploader-blink',
  PRG_RUN: 'ad-progress-run'
};

const attributes = {
  ADD: 'ad-uploader-add',
  UPLOAD: 'ad-uploader-upload',
  DEL: 'ad-uploader-del',
  CTR: 'ad-uploader-control',
  LIST: 'ad-uploader-list',
  ITEM: 'ad-uploader-item',
  ITEM_LINK: 'ad-item-link',
  ITEM_DEL: 'ad-item-delete',
  ITEM_DEL_CONF: 'ad-item-conf',
  TTL: 'title'
};

const strings = {
  CONF: 'Confirm file deletion.'
};

class ADUploader {
  static attachTo(root, opt) {
    let instance = new ADUploader(root, opt);
    // attach instance to the root
    root.ad = root.ad || {};
    root.ad['aduploader'] = instance;
    return instance;
  }
  static getInstance(root) {
    return root.ad && root.ad['aduploader'] ? root.ad['aduploader'] : null;
  }
  constructor(root, opt = {}) {
    this.root_ = root;
    this.opt_ = opt;

    this.formData_ = new FormData();
    this.fileList_ = [];

    this.listenerInfos_ = [
      {re:'uploadClick', ev:'click', ctr: attributes.UPLOAD },
      {re:'change', ev:'change', ctr: 'root' },
      {re:'deleteFile', ev:'click', ctr: attributes.DEL },
      {re: 'controlChange', ev:'change', ctr: attributes.CTR }
    ];
    this.listeners_ = {
      uploadClick: (e) => this.uploadBtnClick_(e),
      change: (e) => this.uploaderChange_(e),
      deleteFile:(e) => this.deleteFiles_(e),
      controlChange:(e) => this.controlChange_(e)
    };
    if(opt.add){
      this.listeners_.addClick = (e) => this.addClick_(e);
      this.listenerInfos_.push({re:'addClick', ev:'click', ctr: attributes.ADD});
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
    return this.formData_;
  }
  getFileList(){
    return this.fileList_;
  }
  setFileList(){}
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

  setConfirm_(domBtn) {
    let atr = domBtn.getAttribute(attributes.ITEM_DEL_CONF);
    let conf = false;
    if(atr) {
      domBtn.classList.remove(cssClasses.BLNK);
      domBtn.classList.add(cssClasses.PRG_RUN);
      conf = true;
    } else {
      domBtn.setAttribute(attributes.ITEM_DEL_CONF, true);
      domBtn.classList.add(cssClasses.BLNK);
      domBtn.setAttribute(attributes.TTL, strings.CONF);
    }
    return conf;
  }

  getRecTmp_(){
    // Wire delete event for the record here.
    let tmp = `  <li class="ad-uploader-item" ad-uploader-item>
        <a href="#" class="ad-uploader-link" ad-item-link></a>
        <div class="ad-uploader-mask"></div>
        <a href="#" class="ad-uploader-delete" ad-item-delete role="button">
          <div class="ad-progress">
            <div class="ad-progress-runner"></div>
          </div>
          <i class="ad-icon">
            <svg viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
          </i>
        </a>
      </li>`;
    let con = document.createElement('div');
    con.innerHTML = tmp;
    let btn = con.querySelector(`[${attributes.ITEM_DEL}]`);
    btn.addEventListener('click', (e) => this.deleteFile_(e));
    return con.firstElementChild;
  }
  addFile_(file) {
    let rec = this.getRecTmp_();
    let item = rec.querySelector(`[${attributes.ITEM_LINK}]`);
    item.textContent = file.name;
    let listCon = this.root_.querySelector(`[${attributes.LIST}]`);
    listCon.appendChild(rec);
  }
  addFormData_(file) {
    this.formData_.append('files', file, file.name);
  }
  addFiles_(){
    let upl = this.root_.querySelector(`[${attributes.CTR}]`);
    let files = upl.files;
    [].forEach.call(files, (f) => {
      this.addFile_(f);
      this.addFormData_(f);
    });
    // Clear control to accept more files
    // if needed...
    upl.value = '';
  }
  removeFile_(domBtn) {
    let rec = util.closest(domBtn, `[${attributes.ITEM}]`);
    rec.remove();
  }
  // Event handlers
  uploadBtnClick_(e) {}
  uploaderChange_(e) {}
  deleteFiles_(e) {}
  deleteFile_(e) {
    let btn = e.currentTarget;
    if(this.setConfirm_(btn)){
      this.removeFile_(btn);
    }
  }
  addClick_(e) {
    document.querySelector(`[${attributes.CTR}]`).click();
  }
  controlChange_(e) {
    this.addFiles_();
  }
}
