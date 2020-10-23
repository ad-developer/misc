var ad = ad || {};
ad.ADToggle = (function(){

  /*
    <div class="ad-toggle-button" ad-toogle ad-toggle-state="on\off\partial">
      <i class="ad-toggle-icon" ad-toogle-on></i>
      <i class="ad-toggle-icon" ad-toggle-off style="display:none"></i>
      <i class="ad-toggle-icon" ad-toggle-partial style="display:none"></i>
    <div>
  */
  var ADToggle = function(root, opt) {
    var $this = this;
    $this.root_ = root;
    $this.opt_ = opt;
    $this.statate_ = null;

    $this.onBtn_ = null;
    $this.offBtn_ = null;
    $this.partial_Btn_ = null;

    $this.init();
  };

  ADToggle.attachTo = function(root, opt) {
    var instance = new ADToggle(root, opt);
    root.ad = root.ad || {};
    root.ad['TOGGLE'] = instance;
    return instance;
  };

  ADToggle.getInstance = function(root) {
      return root.ad && root.ad['TOGGLE'] ? root.ad['TOGGLE'] : null;
  };

  ADToggle.prototype = {
    init: function(){
      var $this = this;
      $this.statate_ = $this.root_.getAttribute('ad-toggle-state');

      $this.onBtn_ = $this.root_.querySelector('[ad-toogle-on]');
      $this.offBtn_ = $this.root_.querySelector('[ad-toggle-off]');
      $this.partialBtn_ = $this.root_.querySelector('[ad-toggle-partial]');

      $this.root_.addEventListener('click', function(){
        $this.toggle_();
      });
    },
    set: function(state){
      var $this = this;
      if(['on', 'off', 'partial'].indexOf(state) > -1){
        $this.statate_ =  state;
        if(state === 'on') {
            $this.setBtns_(true, false, false);
        } else if(state === 'off') {
          $this.setBtns_(false, true, false);
        } else {
          $this.setBtns_(false, false, true);
        }
        ad.utils.emit(this.root_, 'change', {state: this.statate_});
      }
    },
    get: function(){
      return this.statate_;
    },
    toggle_: function(){
      var state = this.statate_;
      if(state === 'on'){
        state = 'off';
        this.setBtns_(false, true, false);
      } else {
        state = 'on';
        this.setBtns_(true, false, false);
      }
      this.statate_ = state;
      ad.utils.emit(this.root_, 'change', {state: state});
    },
    setBtns_: function(on, off, partial) {
      var flx = 'flex';
      var none = 'none';
      on = on === true ? flx : none;
      off = off === true ? flx : none;
      partial = partial === true ? flx : none;

      this.onBtn_.style.display = on;
      this.offBtn_.style.display = off;
      this.partialBtn_.style.display = partial;
    }
  };

  return ADToggle;

})();
