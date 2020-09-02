var ad = ad || {};
ad.ADHierarchyList = (function(){

  /*
    Template
    <div class="ad-hierarchy-list-container" ad-hierarchy-list>
      <div class="ad-hierarchy-list-header" ad-title></div>
      <div class="ad-hierarchy-list" ad-list></div>
    </div>
  */

  var ADHierarchyList = function(root, opt) {
    this.root_ = root;
    this.title_ = null;
    this.listCont_ = null;
    this.init();
  };

  ADHierarchyList.attachTo = function(root, opt) {
    var instance = new ADHierarchyList(root, opt);
    root.ad = root.ad || {};
    root.ad['HIERARCHY_LIST'] = instance;
    return instance;
  };

  ADHierarchyList.getInstance = function(root) {
      return root.ad && root.ad['HIERARCHY_LIST'] ? root.ad['HIERARCHY_LIST'] : null;
  };

  ADHierarchyList.prototype = {
    init: function(){
      var $this = this;

      $this.title_ = $this.root_.querySelector('[ad-title]');
      $this.listCont_ = $this.root_.querySelector('[ad-list]');
    },
    setTitle: function(title) {
      this.title_.innerHTML = title;
    },
    addGroupItem: function(id, item, noRemove){
      var $this = this;

      var el = ad.utils.createElement($this.groupItemFxt_());
      el.setAttribute('ad-id', id);
      var btn = el.querySelector('[ad-button]');
      if(noRemove){
          btn.innerHTML = '';
          btn.classList.remove('ad-hierarchy-list-button');
          btn.classList.add('ad-no-button');
      } else {
        btn.setAttribute('ad-id', id);
        btn.addEventListener('click', function(e){
          $this.remove_(e.currentTarget);
        });
      }
      var title = el.querySelector('[ad-group-text]')
      title.innerHTML = item;

      this.listCont_.appendChild(el);
    },
    addItem: function(groupId, id, item, noRemove)  {
      var $this = this;
      var grp = $this.root_.querySelector('[ad-group-item][ad-id=' + groupId + ']');
      if(grp){
        var el = ad.utils.createElement($this.itemFxt_());
        el.setAttribute('ad-id', id);
        var btn = el.querySelector('[ad-button]');
        if(noRemove){
            btn.innerHTML = '';
            btn.classList.remove('ad-hierarchy-list-button');
            btn.classList.add('ad-no-button');
        } else {
          btn.setAttribute('ad-id', id);
          btn.setAttribute('ad-grp-id', groupId);
          btn.addEventListener('click', function(e){
            $this.remove_(e.currentTarget);
          });
        }
        var title = el.querySelector('[ad-item-text]')
        title.innerHTML = item;
        var con = grp.querySelector('[ad-group-container]')
        con.appendChild(el);
      }
    },
    groupItemFxt_: function() {
      return '<div class="ad-group-item" ad-group-item><div class="ad-hierarchy-list-button" ad-button><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg></div><div class="ad-group-continer"><div class="ad-group-text" ad-group-text></div><div class="ad-item-container-body" ad-group-container></div></div></div>';
    },
    itemFxt_: function() {
      return '<div class="ad-item" ad-item><div class="ad-hierarchy-list-button ad-sub-button" ad-button><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg></div><div class="ad-item-text" ad-item-text></div></div>';
    },
    remove_: function(el){
      var id = el.getAttribute('ad-id');
      var grpId = el.getAttribute('ad-grp-id');

      //var isParent = false;
      //var parent = el.parentNode;
      //if(parent.hasAttriute('ad-group-item')){

      //}


      //var el = this.root_.querySelector('[ad-group-item][ad-id=' + id + ']');
      //if(!el){
      //  el = this.root_.querySelector('[ad-item][ad-id=' + id + ']');
      //}
      el.parentNode.remove();
      ad.utils.emit(this.root_, 'change', { elId: id, grpId: grpId});
    }
  };

  return ADHierarchyList;

})();
