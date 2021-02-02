const util = {
  el(id){
    return document.getElementById(id);
  }
};

let el = util.el('btn');
el.addEventListener('click', function(){
  alert('here');
})

class Person {
  static convertToUpperCase(str){
    return str.toUpperCase();
  }

  constructor(firstName, lastName) {
    this.first_ = firstName;
    this.last_ = lastName;
  }

  get getFirstName() {
    return this.first_;
  }

  get getLastName() {
    return this.last_;
  }

  getFullName(){
    return this.first_ + ', ' + this.last_;
  }
};

class Child extends Person {
  constructor(firstName, lastName, favoriteToy){
    super(firstName, lastName);
    this.toy_ = favoriteToy;
  }
  get getFullNameWithToy(){
    return 'My Full Name is ' + this.first_ + ', ' + this.last_ + '... and my favorite toy is ' + this.toy_;
  }
}

util.el('name').addEventListener('click', function(){
  let nm = new Person('John','Smith');
  alert(nm.getFirstName);
  alert(nm.getLastName);
  alert(nm.getFullName());
  alert(Person.convertToUpperCase(nm.getFullName()));
  let child = new Child('Boy','George','Fire Truck');
  alert(child.getFullNameWithToy);
});
