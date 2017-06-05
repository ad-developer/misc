var util = {el:function(id) {
  return document.getElementById(id);
}, isString:function(val) {
  return typeof val == "string";
}, elCreate:function(tagName) {
  return document.createElement(tagName);
}};
var Resizer = function(cont, noShrink) {
  noShrink = noShrink === undefined ? true : noShrink;
  if (util.isString(cont)) {
    cont = util.el(cont);
  }
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
  this.createGrip_();
  this.grip_.addEventListener("mousedown", this, false);
  document.documentElement.addEventListener("mousemove", this, false);
  document.documentElement.addEventListener("mouseup", this, false);
};
Resizer.prototype.createGrip_ = function() {
  var gripCont = util.elCreate("div");
  var temp = '<div class="grip-row"><div class="no-cell"></div><div class="no-cell"></div><div class="grip-cell"></div></div><div class="grip-row"><div class="no-cell"></div><div class="grip-cell"></div><div class="grip-cell"></div></div><div class="grip-row"><div class="grip-cell"></div><div class="grip-cell"></div><div class="grip-cell"></div></div>';
  gripCont.setAttribute("class", "grip");
  gripCont.innerHTML = temp;
  this.cont_.appendChild(gripCont);
  this.grip_ = gripCont;
};
Resizer.prototype.handleEvent = function(e) {
  if (e.type == "mousedown") {
    var w = parseInt(document.defaultView.getComputedStyle(this.cont_).width, 10);
    var h = parseInt(document.defaultView.getComputedStyle(this.cont_).height, 10);
    this.startX_ = e.clientX;
    this.startY_ = e.clientY;
    if (this.noShr_) {
      if (this.first_) {
        this.maxW_ = w;
        this.maxH_ = h;
        this.first_ = false;
      }
    }
    this.startW_ = w;
    this.startH_ = h;
    this.dragOn_ = true;
  }
  if (e.type == "mousemove" && this.dragOn_) {
    var w$0 = this.startW_ + e.clientX - this.startX_;
    var h$1 = this.startH_ + e.clientY - this.startY_;
    if (this.noShr_) {
      if (this.maxW_ < w$0) {
        this.cont_.style.width = w$0 + "px";
      }
      if (this.maxH_ < h$1) {
        this.cont_.style.height = h$1 + "px";
      }
    } else {
      this.cont_.style.width = w$0 + "px";
      this.cont_.style.height = h$1 + "px";
    }
  }
  if (e.type == "mouseup" && this.dragOn_) {
    this.dragOn_ = false;
  }
};

new Resizer('cont1');
new Resizer('cont2');
