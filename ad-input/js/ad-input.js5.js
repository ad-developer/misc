var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
var strings = {INPUT_KEY:"ad-input", INPUT_CTR:"ad-input", LABEL:"ad-label", LABEL_STAR:"ad-label-required", LINE:"ad-line", VALUE:"ad-value", CHANGE:"change"}, cssClasses = {SELECTED:"selected"}, ADInputFoundation = function(a) {
  a = void 0 === a ? {} : a;
  var b = this;
  this.adapter_ = Object.assign(ADInputFoundation.defaultAdapter, a);
  this.listeners_ = {focus:function(a) {
    return b.focus_(a);
  }, blur:function(a) {
    return b.blur_(a);
  }};
};
ADInputFoundation.prototype.init = function() {
  this.addEventListeners_();
};
ADInputFoundation.prototype.setViewState = function(a) {
};
ADInputFoundation.prototype.getValue = function() {
  return this.adapter_.getValue();
};
ADInputFoundation.prototype.setValue = function(a) {
  "" !== a && (this.adapter_.addClass(ADInputFoundation.cssClasses.SELECTED), this.adapter_.removeClass(ADInputFoundation.cssClasses.SELECTED));
  this.adapter_.setValue(a);
  this.adapter_.triggerChange(a);
};
ADInputFoundation.prototype.destroy = function() {
};
ADInputFoundation.prototype.addEventListeners_ = function() {
  var a = this;
  Object.keys(this.listeners_).forEach(function(b) {
    a.adapter_.registerInteractionHandler(b, a.listeners_[b]);
  });
};
ADInputFoundation.prototype.focus_ = function(a) {
  this.adapter_.addClass(ADInputFoundation.cssClasses.SELECTED);
};
ADInputFoundation.prototype.blur_ = function(a) {
  a = this.getValue();
  this.adapter_.removeClass(ADInputFoundation.cssClasses.SELECTED, "" === a);
};
$jscomp.global.Object.defineProperties(ADInputFoundation, {cssClasses:{configurable:!0, enumerable:!0, get:function() {
  return cssClasses;
}}, strings:{configurable:!0, enumerable:!0, get:function() {
  return strings;
}}, numbers:{configurable:!0, enumerable:!0, get:function() {
  return {};
}}, defaultAdapter:{configurable:!0, enumerable:!0, get:function() {
  return {addClass:function() {
  }, removeClass:function() {
  }, registerInteractionHandler:function() {
  }, deregisterInteractionHandler:function() {
  }, setDisplayMode:function() {
  }, getValue:function() {
    return "";
  }, setValue:function() {
  }};
}}});
var ADInput = function(a, b, c) {
  c = void 0 === c ? {} : c;
  this.root_ = a;
  this.initialize(c);
  this.foundation_ = void 0 === b ? this.getDefaultFoundation() : b;
  this.foundation_.init();
  this.initialSyncWithDOM();
};
ADInput.attachTo = function(a, b) {
  return new ADInput(a, void 0, b);
};
ADInput.attachToMany = function(a, b) {
  a = document.querySelectorAll(a);
  for (var c = 0, d, e; a[c]; c++) {
    d = a[c], e = new ADInput(d, void 0, b), d.ad = d.ad || {}, d.ad[ADInputFoundation.strings.INPUT_KEY] = e;
  }
};
ADInput.getInstance = function(a) {
  return a.ad && a.ad[ADInputFoundation.strings.INPUT_KEY] ? a.ad[ADInputFoundation.strings.INPUT_KEY] : null;
};
ADInput.prototype.initialize = function(a) {
};
ADInput.prototype.getDefaultFoundation = function() {
  var a = this;
  return new ADInputFoundation({addClass:function(b) {
    var c = a.root_.querySelector("[" + ADInputFoundation.strings.LABEL + "]"), d = a.root_.querySelector("[" + ADInputFoundation.strings.LINE + "]");
    c.classList.add(b);
    d.classList.add(b);
  }, removeClass:function(b, c) {
    c = void 0 === c ? !1 : c;
    a.root_.querySelector("[" + ADInputFoundation.strings.LINE + "]").classList.remove(b);
    c && a.root_.querySelector("[" + ADInputFoundation.strings.LABEL + "]").classList.remove(b);
  }, registerInteractionHandler:function(b, c) {
    a.root_.querySelector("[" + ADInputFoundation.strings.INPUT_CTR + "]").addEventListener(b, c);
  }, setDisplayMode:function() {
  }, getValue:function() {
    return a.root_.querySelector("[" + ADInputFoundation.strings.INPUT_CTR + "]").value.trim();
  }, setValue:function(b) {
    var c = a.root_.querySelector("[" + ADInputFoundation.strings.INPUT_CTR + "]");
    c.setAttribute(ADInputFoundation.strings.VALUE, b);
    c.value = b;
  }, triggerChange:function(b) {
    a.emit(ADInputFoundation.strings.CHANGE, b);
  }});
};
ADInput.prototype.initialSyncWithDOM = function() {
};
ADInput.prototype.destroy = function() {
  this.foundation_.destroy();
};
ADInput.prototype.listen = function(a, b) {
  this.root_.addEventListener(a, b);
};
ADInput.prototype.unlisten = function(a, b) {
  this.root_.removeEventListener(a, b);
};
ADInput.prototype.emit = function(a, b, c) {
  c = void 0 === c ? !1 : c;
  if ("function" === typeof CustomEvent) {
    var d = new CustomEvent(a, {detail:b, bubbles:c});
  } else {
    d = document.createEvent("CustomEvent"), d.initCustomEvent(a, c, !1, b);
  }
  this.root_.dispatchEvent(d);
};
$jscomp.global.Object.defineProperties(ADInput.prototype, {value:{configurable:!0, enumerable:!0, get:function() {
  return this.foundation_.getValue();
}, set:function(a) {
  this.foundation_.setValue(a);
}}});
ADInput.attachToMany("[ad-input-control]");
