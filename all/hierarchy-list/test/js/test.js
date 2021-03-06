
(function(){

  var list = ad.ADHierarchyList.attachTo(document.querySelector('[ad-hierarchy-list]'));

  list.setTitle('Test List');
  //list.addGroupItem('(test)/t\'est', 'First Group with some characters');
  //list.addGroupItem('firstGroup', 'First Group');
  //list.addGroupItem('firstGroup', 'First Group');
  //list.addGroupItem('firstGroup', 'First Group');
  //list.addGroupItem('firstGroup', 'First Group');
  //list.addGroupItem('secondGroup', 'Second Group', true);
  //list.addGroupItem('thirdGroup', 'Third Group');
  //list.addItem('thirdGroup', 'subGroupOne','Sub Group One');
  //list.addItem('thirdGroup', 'subGroupTwo','Sub Group Two', true);

  var el = document.querySelector('[ad-hierarchy-list]');
  el.addEventListener('change', function(e){
    var data = e.detail;
    alert('Deleted id: ' + data.elId + ' with group id: ' + data.grpId);
  });

  document.querySelector('[ad-add]')
    .addEventListener('click', function(){
      var val = document.querySelector('[ad-value]');
      var txt = document.querySelector('[ad-text]');
      list.addGroupItem(val.value, txt.value);
    });

})();
