
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
  constructor(cont, noShrink = true) {
    // Container can be either dom element
    // or container id.
    if(util.isString(cont)){
      cont = util.el(cont);
    }
    // Init variables.
    this.grip_ = null;
    this.startX_ = null;
    this.startY_ = null;

    this.startW_ = null;
    this.startH_ = null;

    this.first_ = true;
    this.maxW_ = null;
    this.maxH_ = null;

    this.cont_ = cont;
    this.noShr_ = noShrink;

    // Create grip element.
    this.createGrip_();

    // Add event listeners.
    this.grip_.addEventListener('mousedown',this, false);
    document.documentElement.addEventListener('mousemove', this, false);
    document.documentElement.addEventListener('mouseup', this, false);
  }
  createGrip_(){
    let gripCont = util.elCreate('div');
    let temp = `<div class="grip-row"><div class="no-cell"></div><div class="no-cell"></div><div class="grip-cell"></div></div><div class="grip-row"><div class="no-cell"></div><div class="grip-cell"></div><div class="grip-cell"></div></div><div class="grip-row"><div class="grip-cell"></div><div class="grip-cell"></div><div class="grip-cell"></div></div>`;
    gripCont.setAttribute('class', 'grip');
    gripCont.innerHTML = temp;
    this.cont_.appendChild(gripCont);
    this.grip_ = gripCont;
  }
  handleEvent(e){
    if(e.type == 'mousedown'){
      let w = parseInt(document.defaultView.getComputedStyle(this.cont_).width, 10);
      let h = parseInt(document.defaultView.getComputedStyle(this.cont_).height, 10);
      this.startX_ = e.clientX;
      this.startY_ = e.clientY;

      if(this.noShr_){
        if(this.first_){
          this.maxW_ = w;
          this.maxH_ = h;
          this.first_ = false;
        }
      }
      this.startW_ = w;
      this.startH_ = h;
      this.dragOn_ = true;
    }
    if(e.type == 'mousemove' && this.dragOn_){
      let w = (this.startW_ + e.clientX - this.startX_);
      let h = (this.startH_ + e.clientY - this.startY_);
      if(this.noShr_){
        if(this.maxW_ < w){
          this.cont_.style.width = w + 'px';
        }
        if(this.maxH_ < h){
          this.cont_.style.height = h + 'px';
        }
      } else {
          this.cont_.style.width = w + 'px';
          this.cont_.style.height = h + 'px';
      }
    }
    if(e.type == 'mouseup' && this.dragOn_){
      this.dragOn_ = false;
    }
  }
}

// test
//

//new Resizer('cont1');
//new Resizer('cont2');
