
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
  }


});
