
let u = {
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

/***************************************************/

let btn = u.el('searchBtn');
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

/***************************************************/

let navBtn = u.el('nav-menu-btn');
let mask = document.querySelector('[ad-mask]');
navBtn.addEventListener('click', function(){
  var men = document.querySelector('[ad-drawer]');
  u.addClass(men, 'show');
  mask.style.display = 'block';
});

mask.addEventListener('click', function(){
  var men = document.querySelector('[ad-drawer]');
  u.removeClass(men, 'show');
  mask.style.display = 'none';
});

let navList = document.querySelectorAll('[ad-drawer] dt');
for (let i = 0, el; i < navList.length; i++) {
  el = navList[i];
  console.log(el.textContent);
  el.addEventListener('click', function(event){
    let par = event.target.parentNode;
    let nl = par.querySelector('.nav-list');
    if(nl.classList.contains('show')){
      u.removeClass(nl, 'show');
    } else {
      u.addClass(nl, 'show');
    }
    console.log(event.target.textContent);
  });
};

/***************************************************/

// Identity show
let ident = document.querySelector('[ad-identity]');
ident.addEventListener('click', function(event){
  if(!this.classList.contains('show')){
    this.classList.add('show');
  }
});

// Identity hide (click anythrere)
document.addEventListener('click', function(event){
  let el = document.querySelector('[ad-identity]');
  let tarEl = event.target;
  if(!tarEl.classList.contains('ad-identity') && el.classList.contains('show')){
    u.removeClass(el, 'show');
  }
});
