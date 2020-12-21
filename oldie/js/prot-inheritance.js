var Car = function(type){
  this.type_ = type;
};

Car.prototype.getType = function(){
  return this.type_;
};

var Honda = function(type, model) {
  Car.call(this, type);
  this.model_ = model;
};

Honda.prototype = Object.create(Car.prototype);
Object.defineProperty(Holda.prototype, 'constructor', {
  value: Honda,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});
