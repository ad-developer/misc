
var u = {
  el: function(id){
    return document.getElementById(id);
  },
  addClass: function(el, cl){
    el.classList.add(cl);
  },
  removeClass: function(el, cl){
    el.classList.remove(cl);
  },
  addAttr: function(el, attr, val) {
    el.setAttribute(attr, val);
  },
  getAttr: function(el, attr) {
    return el.getAttribute(attr);
  }
}
var btn = u.el('searchBtn');

btn.addEventListener('click', function(){

  var search = u.getAttr(btn, 'ad-search');
  var el = u.el('searchCon');
  if(search || (search !== null && search != "true")){
    u.removeClass(el,'search-container-show');
    u.addAttr(btn, 'ad-search', false);
  } else {
    u.addClass(el, 'search-container-show');
    u.addAttr(btn, 'ad-search', true);
    var inp = u.el('searchInput');
    inp.focus();
    inp.select();
  }


});

var navBtn = u.el('nav-menu-btn');

var mask = u.el('nav-mask');
navBtn.addEventListener('click', function(){
  var men = u.el('nav-menu');
  u.addClass(men, 'show');
  u.addClass(mask, 'show');
});


mask.addEventListener('click', function(){
  var men = u.el('nav-menu');
  u.removeClass(men, 'show');
  u.removeClass(mask, 'show');
});

var navList = document.querySelectorAll('.nav-menu dt');

for (var i = 0, el; i < navList.length; i++) {
  el = navList[i];
  console.log(el.textContent);
  el.addEventListener('click', function(event){
    var par = event.target.parentNode;
    var nl = par.querySelector('.nav-list');
    if(nl.classList.contains('show')){
      u.removeClass(nl, 'show');
    } else {
      u.addClass(nl, 'show');
    }

    console.log(event.target.textContent);
  });
};

var ident = u.el('identity');
ident.addEventListener('click', function(event){
  var el = event.target;
  if(!el.classList.contains('show')){
    u.addClass(el, 'show');
  }
});

document.addEventListener('click', function(event){
  var el = u.el('identity');
  var tarEl = event.target;
  if(!tarEl.classList.contains('navbar-identity') && el.classList.contains('show')){
    u.removeClass(el, 'show');
  }
});
