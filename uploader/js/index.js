document.querySelector('[ad-uploader-button]')
.addEventListener('click',function(e){
  document.querySelector('[ad-uploader-control]').click();
});

let send = function(){

};

document.querySelector('[ad-uploader-control]')
.addEventListener('change', function(e){
  let list = this.files;
  let formData = new FormData();
  [].forEach.call(list, function(f){
    formData.append();
  });
});


/*
  uploader:
    getFormData
    getFileList -
    *removeFileHandler
    setFileList
*/

const cssClasses = {

};

const attributes = {

}

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
    this.listeners_ = {
      click: (e) => this.uploadBtnClick_(e),
      change: (e) => this.uploaderChange_(e),
      deleteFile:(e) => this.deleteFile_(e),
    };
    this.initialize();
  }
  initialize() {
    this.activate();
  }
  activate() {
    this.addEventListeners_();
  }
  addEventListeners_(){

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
}
