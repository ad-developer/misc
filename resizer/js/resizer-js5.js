function b(a) {
  "string" == typeof a && (a = document.getElementById(a));
  this.f = this.g = this.i = this.h = this.c = null;
  this.a = a;
  this.a.innerHTML = '\n    <div class="grip" id="grip_">\n      <div class="grip-row">\n        <div class="no-cell"></div>\n        <div class="no-cell"></div>\n        <div class="grip-cell"></div>\n      </div>\n      <div class="grip-row">\n        <div class="no-cell"></div>\n        <div class="grip-cell"></div>\n        <div class="grip-cell"></div>\n      </div>\n      <div class="grip-row">\n        <div class="grip-cell"></div>\n        <div class="grip-cell"></div>\n        <div class="grip-cell"></div>\n      </div>\n    </div>\n    ';
  this.c = document.getElementById("grip_");
  this.c.addEventListener("mousedown", this.l.bind(this), !1);
}
b.prototype.l = function(a) {
  this.h = a.clientX;
  this.i = a.clientY;
  this.g = parseInt(document.defaultView.getComputedStyle(this.a).width, 10);
  this.f = parseInt(document.defaultView.getComputedStyle(this.a).height, 10);
  document.documentElement.addEventListener("mousemove", this.b.bind(this), !1);
  document.documentElement.addEventListener("mouseup", this.j.bind(this), !1);
};
b.prototype.b = function(a) {
  this.a.style.width = this.g + a.clientX - this.h + "px";
  this.a.style.height = this.f + a.clientY - this.i + "px";
};
b.prototype.j = function() {
  document.documentElement.removeEventListener("mousemove", this.b, !1);
  document.documentElement.removeEventListener("mouseup", this.j, !1);
};
new b("cont");
