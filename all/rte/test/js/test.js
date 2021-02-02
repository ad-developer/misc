var ed = document.querySelector('[ad-test]');
ad.ADRte.attachTo(ed);
ed.addEventListener('change', function(){
  //alert('chnage ed');
});

var ed2 = document.querySelector('[ad-test-two]');
ad.ADRte.attachTo(ed2);

ed2.addEventListener('change', function(){
  //alert('chnage ed2');
});
