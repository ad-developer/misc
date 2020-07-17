var ad = ad || {};
ad.ADMultiselect = (function(){

  //CONTROL TAG
  //  <div
  //    ad-id="id"
  //    ad-ms-default-text="Text appears on control when no selection"
  //    ad-required
  //    ></div>

  //  LIST FORMAT:
  //  [{text:'text', value: 'value'}, ...]

  var ADMultiselect = function(root, opt) {
    var $this = this;
    $this.root_ = root;
    $this.opt_ = opt;
    $this.attr_ = null;
    $this.id_ = null;
    $this.defautlText_ = null;
    $this.required_ = null;
    $this.requiredCtr_ = null;

    // Show/hide list
    $this.boxCrt_ = null;
    // Sel options header
    $this.selOptionsCtr_ = null;
    // Filter input box
    $this.filterImputCtr_ = null;
    // List control
    $this.listCtr_ = null;

    // Selected items list
    $this.valueList_ = null;
    $this.textList_ = null;

    $this.init();
  };

  ADMultiselect.attachTo = function(root, opt) {
    var instance = new ADMultiselect(root, opt);
    root.ad = root.ad || {};
    root.ad['MULTISELECT'] = instance;
    return instance;
  };

  ADMultiselect.getInstance = function(root) {
      return root.ad && root.ad['MULTISELECT'] ? root.ad['MULTISELECT'] : null;
  };

  ADMultiselect.prototype = {
    init: function(){
      var $this = this;
      $this.id_ = $this.root_.getAttribute('ad-id');
      $this.defautlText_ = $this.root_.getAttribute('ad-ms-default-text');
      $this.required_ = false;
      var required = $this.root_.hasAttribute('ad-required');
      if(required) {
        $this.required_ = true;
      }
      $this.valueList_ = [];
      $this.textList_ = [];

      $this.build_();
      if($this.opt_) {
      var list = $this.opt_.list;
        if(list){
          $this.load(list);
        }

        var selList = $this.opt_.selList;
        if(selList){
          $this.setSelectedData(selList);
        }
      }
    },
    load: function(data){
      var $this = this;
      for (var i = 0, el; el = data[i]; i++) {
        var fxt = $this.listItemFixture_();
        var ctr = ad.utils.createElement(fxt);
        ctr.setAttribute('ad-text', el.text);
        ctr.setAttribute('ad-value', el.value);

        ctr.querySelector('[ad-list-item-text]')
          .innerHTML = el.text;

        ctr.addEventListener('click', function(e){
          var sel = this.hasAttribute('ad-selected');
          var icon = this.querySelector('[ad-ms-checkbox-icon]');
          var dsp = 'none';
          var value = this.getAttribute('ad-value');
          var text = this.getAttribute('ad-text');

          if(sel) {
            this.removeAttribute('ad-selected');
            $this.removeFromList_(text, value);
          } else {
            this.setAttribute('ad-selected','');
            dsp = 'flex';
            $this.addToList_(text, value);
          }
          icon.style.display = dsp;
          $this.updateHeader_();
        });
        this.listCtr_.appendChild(ctr);
      }
    },
    getSelectedData: function() {
      return this.valueList_;
    },
    setSelectedData: function(data){
      this.clear();
      for (var i = 0, value; value =  data[i]; i++) {
        var lstItem = this.listCtr_.querySelector('[ad-value=' + value + ']');
        lstItem.setAttribute('ad-selected','');
        var text = lstItem.getAttribute('ad-text');
        var ind = lstItem.querySelector('[ad-ms-checkbox-icon]');
        ind.style.display = 'flex';
        this.addToList_(text, value);
      }
      this.updateHeader_();
    },
    clear: function(){
      this.valueList_ = [];
      this.textList_ = [];
      var items = this.listCtr_.querySelectorAll('[ad-selected]');
      for (var i = 0, item; item = items[i]; i++) {
        item.removeAttribute('ad-selected');
        var ind = item.querySelector('[ad-ms-checkbox-icon]');
        ind.style.display = 'none';
      }
      this.updateHeader_();
    },
    build_: function(){
      var $this = this;
      var root = $this.root_;
      var fxt = $this.ctrFixture_();
      $this.root_.innerHTML = fxt;

      if($this.required_){
        var inpElement = document.createElement('input');
        inpElement.style.display = 'none';
        inpElement.setAttribute('ad-val','');
        inpElement.setAttribute('ad-val-required','');
        $this.root_.appendChild(inpElement);
        $this.requiredCtr_ = inpElement;
      }

      $this.boxCrt_ = root.querySelector('[ad-ms-box]');
      $this.boxCrt_.addEventListener('click', function(){
          var isOpened = $this.root_.hasAttribute('ad-opened');
          if(isOpened){
            $this.closeList_();
          } else {
            $this.openList_();
          }
      });

      $this.selOptionsCtr_ = root.querySelector('[ad-ms-selected-options]');
      $this.selOptionsCtr_.innerHTML = $this.defautlText_;
      $this.listCtr_ = root.querySelector('[ad-ms-list]');

      $this.filterImputCtr_ = root.querySelector('[ad-ms-filter-imput]');
      $this.filterImputCtr_.addEventListener('keyup', function(){
        var list = $this.listCtr_.querySelectorAll('[ad-list-item]');
        var text = this.value.toLowerCase().trim();
        for (var i = 0, dsp, val, el; el = list[i]; i++) {
          val = el.getAttribute('ad-text').toLowerCase();
          dsp = 'none';
          if(val.search(text) > -1) {
             dsp = 'flex';
          }
          el.style.display = dsp;
        }
      });

    },
    addToList_: function(text, value) {
      this.textList_.push(text);
      this.valueList_.push(value);
    },
    removeFromList_: function(text, value) {
      var textPos = this.textList_.indexOf(text);
			var	valPos = this.valueList_.indexOf(value);
			if(textPos > -1){
				this.textList_.splice(textPos, 1);
			}
			if(valPos > -1){
				this.valueList_.splice(valPos, 1);
			}
    },
    updateHeader_: function() {
      var $this = this;
      var defautlText = $this.defautlText_;
      var ln = $this.textList_.length > 0;
      if(ln){
        defautlText = $this.textList_.join(', ');
      }
      $this.selOptionsCtr_.innerHTML = defautlText;
      if($this.required_) {
          var val = '';
          if(ln) {
            val = 'c';
          }
          $this.requiredCtr_.value = val;
          ad.utils.emit($this.requiredCtr_, 'blur');
      }
    },
    ctrFixture_: function(){
      return '<div class="ad-ms"><div class="ad-ms-box" ad-ms-box><div class="ad-ms-choices" ad-ms-selected-options></div><b class="ad-ms-box__arrow-down" ad-ms-indicator></b></div><div class="ad-ms-list"><div class="ad-ms-filter-block"><input name="" type="text" ad-ms-filter-imput><i class="ad-ms-icon"><svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg></i></div><ul class="ad-ms-choice-block" ad-ms-list></ul></div></div>';
    },
    listItemFixture_: function(){
      return '<li ad-list-item><div class="ad-ms-checkbox"><i class="ad-ms-checkbox__icon" ad-ms-checkbox-icon style="display: none"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></i></div><span class="ad-ms-choice-text" ad-list-item-text></span></li>';
    },
    openList_: function() {
      var $this = this;
      $this.root_.setAttribute('ad-opened','');
      $this.root_.classList.add('ad-ms-expanded');
      document.body.addEventListener('click', function(e){
        $this.handleBodyClick_(e);
      });
    },
    closeList_: function(){
      var $this = this;
      $this.root_.removeAttribute('ad-opened');
      $this.root_.classList.remove('ad-ms-expanded');
      document.body.removeEventListener('click', function(e){
          $this.handleBodyClick_(e);
      });
    },
    handleBodyClick_: function(e){
      var el = e.target;
      if(this.isELementContainer_(el)) {
        return;
      }
      this.closeList_();
    },
    isELementContainer_: function(el) {
      return this.root_ === el
        || this.root_.contains(el);
    }
  };

  return ADMultiselect;

})();
