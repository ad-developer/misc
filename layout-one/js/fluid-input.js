var util = util || {};

util.addRemoveClasses_ = function(e,add){
  var  cl = 'selected'
      tar = e.target,
      sib = tar.nextElementSibling,
      par = tar
        .parentElement
        .parentElement
        .querySelector('.select');
        
  par.classList.remove(cl);
  if(add){
    sib.classList.add(cl);
    par.classList.add(cl);
  } else if(tar.value.trim() === ''){
    sib.classList.remove(cl);
  }
};

util.setFluidInput = function(){
  var els = document.querySelectorAll('[fluid-input]'),
      i = 0,
      el;
  for (; i < els.length; i++) {
    el = els[i];
    // add focus event
    el.addEventListener('focus', function(e){
      util.addRemoveClasses_(e, true);
    });
    // add blur event
    el.addEventListener('blur', function(e){
      util.addRemoveClasses_(e, false);
    });
  }
};
// register all coltrols
// on the page
util.setFluidInput();
