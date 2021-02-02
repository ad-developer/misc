var toggle = ad.ADToggle.attachTo(document.querySelector('[ad-toogle]'));

document.querySelector('[set-partial-btn]')
  .addEventListener('click', function(){
    toggle.set('partial');
  });

document.querySelector('[ad-toogle]')
 .addEventListener('change', function(e){
   alert(e.detail.state);
 });
