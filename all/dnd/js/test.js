/*
  Settings:
  1. By defalult all events are activationHasEnded
  2. Action can be all (by default and does not need to be specified)
     or only drop (container) or only drag (item)
  3. transform custom event handler
  4. drop custom evnet handler
  ADDnd.attachTo(el, {
    action: 'drop | drag' -
    drop: function(e){

    }
  });

  https://developer.mozilla.org/en-US/docs/Web/Events/dragover
*/
/*
  Transformations:

  <!--
    Placeholder checkbox (dynamic)
    Transformation: ad-plc-checkbox - hook attribute
    To dest: remove hide class
    To src: add hide class, uncheck checkbox checkbox.setState('uncheck')
  -->
  <!--
    Placeholder icon fixed width (dynamic)
    Transformation: ad-plc-required, ad-plc-required-cont - hook
      attributes
    To dest: remove hide class, keep hide on content
    To src: add hide class, add hide class to content
  -->
  <!--
    Placeholder chips (dynamic)
    Transformation: ad-plc-chip, ad-plc-chip-cont - hook attributes
    To dest: do nothing
    To src: add hide class, remove all content
  -->
  <!--
    Type icon (dynamic)
    Transformation: ad-dnd-comp-type - hook attribute
    To dest: remove ad-right-24 class
    To src: add ad-right-24 class
  -->
*/

const htmStrings = {
  CHECK_BOX: '<span class=ad-right-24><i ad-checkbox class="list-icon checked"role=button><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> </i><i ad-checkbox class="list-icon hide"role=button ad-hidden><svg viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z"fill=none /></svg></i></span>',
  CHIP: '<div class="ad-chip ad-chip-red" ad-plc-chip-cont></div>'
};

const dndTestStrings = {
  PLC_CHECKBOX: 'ad-plc-checkbox',
  PLC_REQUIRED: 'ad-plc-required',
  DND_COMP_TYPE: 'ad-dnd-comp-type',
  SRC_ITEM: 'src-item',
  DEST_ITEM: 'dest-item'
};

const dndTestCssClasses = {
  HIDE: 'hide',
  RIGHT_24: 'ad-right-24'
}

// Drop Item handler....
let dropItemHnd = function(e, callback) {
  let id = e.dataTransfer.getData("text");
  let el = document.getElementById(id);
  let root = this.root;
  let parent = root.parentElement;

  let dropInst = ADDnd.getInstance(el);
  dropInst.deactivate();
  dropInst.activate('all');
  let destItem = dropInst.root.getAttribute(dndTestStrings.DEST_ITEM);
  if(!destItem) {
    dropInst.root.setAttribute(dndTestStrings.DEST_ITEM, 'true');
    // transformation
    let checkbox = dropInst.root.querySelector(`[${dndTestStrings.PLC_CHECKBOX}]`);
    checkbox.classList.remove(dndTestCssClasses.HIDE);

    let req = dropInst.root.querySelector(`[${dndTestStrings.PLC_REQUIRED}]`);
    req.style.display = 'inline-block';

    let comT = dropInst.root.querySelector(`[${dndTestStrings.DND_COMP_TYPE}]`);
    comT.classList.remove(dndTestCssClasses.RIGHT_24);
 }

  parent.insertBefore(el, root);
  callback(true);
}

// Drop item
ADDnd.attachToMany('[ad-drop]',{
  drop: dropItemHnd
});

// Drag item (from source container)
ADDnd.attachToMany('[no-drop]', {
  action:'drag',
  drop: dropItemHnd
});

// Drop source container
ADDnd.attachToMany('[ad-dnd-src]', {
  action:'drop',
  drop: (e, callback)=>{
    let id = e.dataTransfer.getData("text");
    let el = document.getElementById(id);
    let dropInst = ADDnd.getInstance(el);
    let root = this.root;
    dropInst.deactivate();
    dropInst.activate('drag');

    dropInst.root.removeAttribute(dndTestStrings.DEST_ITEM);

    // transformation
    let checkbox = dropInst.root.querySelector(`[${dndTestStrings.PLC_CHECKBOX}]`);
    checkbox.classList.add(dndTestCssClasses.HIDE);

    let req = dropInst.root.querySelector(`[${dndTestStrings.PLC_REQUIRED}]`);
    req.style.display = 'none';

    let comT = dropInst.root.querySelector(`[${dndTestStrings.DND_COMP_TYPE}]`);
    comT.classList.add(dndTestCssClasses.RIGHT_24);

    callback(false);
  }
});

// Drop destination container
ADDnd.attachToMany('[ad-dnd-dest]', {
  action:'drop',
  drop: (e, callback)=>{
    let id = e.dataTransfer.getData("text");
    let el = document.getElementById(id);
    let dropInst = ADDnd.getInstance(el);
    let root = this.root;
    dropInst.deactivate();
    dropInst.activate('all');
    let destItem = dropInst.root.getAttribute(dndTestStrings.DEST_ITEM);
      if(!destItem) {
        dropInst.root.setAttribute(dndTestStrings.DEST_ITEM, 'true');
      // transformation
      let checkbox = dropInst.root.querySelector(`[${dndTestStrings.PLC_CHECKBOX}]`);
      checkbox.classList.remove(dndTestCssClasses.HIDE);

      let req = dropInst.root.querySelector(`[${dndTestStrings.PLC_REQUIRED}]`);
      req.style.display = 'inline-block';

      let comT = dropInst.root.querySelector(`[${dndTestStrings.DND_COMP_TYPE}]`);
      comT.classList.remove(dndTestCssClasses.RIGHT_24);
    }
    callback(false);
  }
});

// Register checkbox
ADCheckbox.attachToMany('[ad-checkbox]', {disp: 'inline-block'});

// Register toolbar checkbox
ADCheckbox
  .attachTo(document.getElementById('hd-cb')
    ,{disp: 'inline-block'});

document.getElementById('hd-cb')
  .addEventListener('change', function(e){
    let st = e.detail;
    let con = document.querySelector('[ad-dnd-dest]');
    let list = con.querySelectorAll('[ad-checkbox][ad-state=check]');
    [].forEach.call(list, function(el){
      el = util.closest(el, '[ad-dnd-item]');
      el = el.querySelector('[ad-plc-required-cont]');
      let disp = 'none';
      if(st === 'check') {
        disp = 'inline-block';
      }
      el.style.display = disp;
    });

  });

document.getElementById('hd-sel')
.addEventListener('change', function(){
  let val = this.getAttribute('ad-val');
  let text = this.getAttribute('ad-text');
  let con = document.querySelector('[ad-dnd-dest]');
  let list = con.querySelectorAll('[ad-checkbox][ad-state=check]');
  [].forEach.call(list, function(el){
    let con = util.closest(el, '[ad-dnd-item]');
    el = con.querySelector('[ad-plc-chip-cont]');
    el.textContent = text;
    el = con.querySelector('[ad-plc-chip]');
    el.style.display = 'inline-block';
  });

});

function moreChxBx(cb) {
  let parent = util.closest(cb,'UL');
  let res = parent.querySelectorAll('[ad-checkbox][ad-state=check]');
  return res && res.length > 0;
}

let cbs = document.querySelectorAll('[ad-checkbox]');
[].forEach.call(cbs, function(ch){
  ch.addEventListener('change', function(e){
    let cb = document.getElementById('hd-cb');
    let lst = document.getElementById('hd-sel');
    if(e.detail === 'check'){
        cb.classList.remove('hide');
        lst.classList.remove('hide');
    } else {
      if(!moreChxBx(ch)){
        cb.classList.add('hide');
        lst.classList.add('hide');
      }
    }
  });
});

document.querySelectorAll('[ad-drop]').forEach((el)=>{
  el.addEventListener('change', (e)=>{
    alert('test');
  });
});
