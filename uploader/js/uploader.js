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
    onUpload - function()
    onChange - function(fileList, formData, callback)

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
  LIST: 'ad-uploader-list',
  ITEM: 'ad-uploader-item',
  ITEM_LINK: 'ad-item-link',
  ITEM_DEL: 'ad-item-delete',
  ITEM_DEL_CONF: 'ad-item-conf',
  TTL: 'title',
  FILE_NAME: 'ad-item-file-name',
  FILE_ID: 'ad-item-file-id'
};

const strings = {
  CONF: 'Confirm file deletion.',
  EV_CHANGE: 'change'
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
      {re: 'upload', ev: 'upload', ctr: 'root'},
      {re:'deleteFile', ev:'click', ctr: attributes.DEL },
    ];
    this.listeners_ = {
      uploadClick: (e) => this.uploadBtnClick_(e),
      deleteFile:(e) => this.deleteFiles_(e),
      //controlChange:(e) => this.controlChange_(e),
      // Two root events
      change: (e) => this.rootChange_(e),
      upload: (e)=> this.rootUpload_(e)
    };
    if(opt.add){
      this.listeners_.addClick = (e) => this.addClick_(e);
      this.listenerInfos_.push({re:'addClick', ev:'click', ctr: attributes.ADD});
    }

    // Holds current instace of the input[type=file] control.
    this.ctr_ = null;

    // This will be used dynamically with each new instance
    // of the input[type=file] control
    this.ctrChgLsn_ = (e)=> this.controlChange_(e);

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

  // Util functions ...
  showContext_(){
    let n = this.fileList_.length;
    let root = this.root_;
    let con = root.querySelector(`[${attributes.LIST}`);
    let upl = root.querySelector(`[${attributes.UPLOAD}`);
    let del = root.querySelector(`[${attributes.DEL}`);
    let st = 'none';
    if(n){
        st = 'block';
    }
    // TODO: Create context array
    con.style.display = st;
    upl.style.display = st;
    del.style.display = st;
  }
  btnIndicator_(btn, show) {
    if(show) {
      btn.classList.add(cssClasses.PRG_RUN);
    } else {
      btn.classList.remove(cssClasses.PRG_RUN);
    }
  }
  setConfirm_(btn) {
    let atr = btn.getAttribute(attributes.ITEM_DEL_CONF);
    let conf = false;
    if(atr) {
      btn.classList.remove(cssClasses.BLNK);
      this.btnIndicator_(btn, true);
      conf = true;
    } else {
      btn.setAttribute(attributes.ITEM_DEL_CONF, true);
      btn.classList.add(cssClasses.BLNK);
      btn.setAttribute(attributes.TTL, strings.CONF);
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
  addFile_(file, fileIndex) {
    let rec = this.getRecTmp_();
    let item = rec.querySelector(`[${attributes.ITEM_LINK}]`);
    item.textContent = file.name;
    // TODO: Add href attribte here ...

    rec.setAttribute(attributes.FILE_NAME, file.name);

    let listCon = this.root_.querySelector(`[${attributes.LIST}]`);
    listCon.appendChild(rec);
    this.fileList_.push({
      name: file.name,
      ind: fileIndex,
      ref: this.ctr_
    });
  }
  addFormData_(file) {
    this.formData_.append('files', file, file.name);
  }
  addFiles_(){
    let btn = this.root_.querySelector(`[${attributes.ADD}]`);
    this.btnIndicator_(btn, true);

    let files = this.ctr_.files;
    [].forEach.call(files, (f, i) => {
      this.addFile_(f, i);
      //this.addFormData_(f);
    });

    this.emit(strings.EV_CHANGE);
    this.btnIndicator_(btn);
  }
  removeFile_(domBtn) {
    let rec = util.closest(domBtn, `[${attributes.ITEM}]`);
    // Remove from the visual list ...
    rec.remove();

    let fileList = this.fileList_;
    let name = rec.getAttribute(attributes.FILE_NAME);
    // Remove from the file list
    [].forEach.call(this.fileList_, (file, i) => {
      if(file.name === name){
        this.fileList_.splice(i,1);
      }
    });

    // Remove from FormData
    this.formData_.delete(name);

  }

  // Event handlers
  uploadBtnClick_(e) {

  }
  deleteFiles_(e) {}
  deleteFile_(e) {
    let btn = e.currentTarget;
    if(this.setConfirm_(btn)){
      this.removeFile_(btn);
      this.emit(strings.EV_CHANGE);
    }
  }
  addClick_(e) {
    let el = this.ctr_;
    if(el){
      el.removeEventListener(strings.EV_CHANGE,this.ctrChgLsn_);
    }
    el = this.ctr_ = document.createElement('input');
    el.setAttribute('type','file');
    el.setAttribute('multiple','multiple');
    el.addEventListener(strings.EV_CHANGE,this.ctrChgLsn_);
    el.click();
  }
  controlChange_(e) {
    this.addFiles_();
  }
  rootChange_(e) {
    this.showContext_();
  }
  rootUpload_(e) {
  }
}
