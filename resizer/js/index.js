
const util = {
  el(id){
    return document.getElementById(id);
  },
  isString(val) {
    return typeof val == 'string';
  },
  elCreate(tagName) {
    return document.createElement(tagName)
  }
};

class Resizer {
  constructor(cont, conf=null) {
    if(util.isString(cont)){
      cont = util.el(cont);
    }
    this.grip_ = null;
    this.startX_ = null;
    this.startY_ = null;
    this.startW_ = null;
    this.startH_ = null;
    this.dragHnd_ = null;
    this.stopHnd_ = null;
    this.cont_ = cont;
    this.conf_ = conf;
    this.createGrip_();
    //this.grip_.addEventListener('mousedown', this.initDrag_.bind(this), false);
    this.grip_.addEventListener('mousedown',this, false);
    document.documentElement.addEventListener('mousemove', this, false);
    document.documentElement.addEventListener('mouseup', this, false);
  }
  createGrip_(){
    let temp = `
    <div class="grip" id="grip_">
      <div class="grip-row">
        <div class="no-cell"></div>
        <div class="no-cell"></div>
        <div class="grip-cell"></div>
      </div>
      <div class="grip-row">
        <div class="no-cell"></div>
        <div class="grip-cell"></div>
        <div class="grip-cell"></div>
      </div>
      <div class="grip-row">
        <div class="grip-cell"></div>
        <div class="grip-cell"></div>
        <div class="grip-cell"></div>
      </div>
    </div>
    `;
    this.cont_.innerHTML = temp;
    this.grip_ = util.el('grip_');
  }
  initDrag_(e){
    this.startX_ = e.clientX;
    this.startY_ = e.clientY;
    this.startW_ = parseInt(document.defaultView.getComputedStyle(this.cont_).width, 10);
    this.startH_ = parseInt(document.defaultView.getComputedStyle(this.cont_).height, 10);
    this.dragHnd_ = this.doDrag_.bind(this);
    this.stopHnd_ = this.stopDrag_.bind(this);
    //console.log(this.dragHnd_);
    //console.log(this.stopHnd_);
    document.documentElement.addEventListener('mousemove', this, false);
    document.documentElement.addEventListener('mouseup', this, false);
  }
  handleEvent(e){
    if(e.type == 'mousedown'){
      this.startX_ = e.clientX;
      this.startY_ = e.clientY;
      this.startW_ = parseInt(document.defaultView.getComputedStyle(this.cont_).width, 10);
      this.startH_ = parseInt(document.defaultView.getComputedStyle(this.cont_).height, 10);
      this.dragOn_ = true;

    }
    if(e.type == 'mousemove' && this.dragOn_){
      this.cont_.style.width = (this.startW_ + e.clientX - this.startX_) + 'px';
      this.cont_.style.height = (this.startH_ + e.clientY - this.startY_) + 'px';
    }
    if(e.type == 'mouseup' && this.dragOn_){
      this.dragOn_ = false;
    }
    console.log(e.type);
  }
  doDrag_(e){
    this.cont_.style.width = (this.startW_ + e.clientX - this.startX_) + 'px';
    this.cont_.style.height = (this.startH_ + e.clientY - this.startY_) + 'px';
  }
  stopDrag_(){
    document.documentElement.removeEventListener('mousemove', this, false);
    document.documentElement.removeEventListener('mouseup', this, false);
  }
}

// test
//

new Resizer('cont');
