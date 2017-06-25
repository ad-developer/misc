// dnd.js

/*
  Definitions:
  ad-dnd-container - draggable items' container
  ad-dnd-item - draggable item
  no-drop - sub option for [ad-dnd-item] identify no drop capability
  drop  - sub option for [ad-dnd-item] identify drop capability
  ad-dnd-[optional] - can be used as optional attribute
  ad-dnd-grip - grip element within [ad-dnd-item]
  ad-dnd-comp-type - component type element within [ad-dnd-item]
  ad-dnd-title - comp title element
*/

/*
 1. attach event to the container
 2. update positioon of the element inside container
 3. transform element custorm handler
 4. drop element custom handler
 5. attach / detach event(s) upon transformation
 6. attach different event(s) based on the role
*/

const cssClasses = {
  OVER: 'ad-over'
};
const cssAttributes = {
  DND_CONTAINER: 'ad-dnd-container',
  DND_ITEM: 'ad-dnd-item',
  DND_NO_DROP: 'no-drop',
  DND_GRIP: 'ad-dnd-grip'
};
const strings = {
  CHANGE_EVENT: 'ad.change'
};
const numbers = {
  OP_START: 0.4,
  OP_END: 1
};

class ADDnd {
  static attachTo(root, opt) {
    let instance = new ADDnd(root, opt);
    // attach instance to the root
    root.ad = root.ad || {};
    root.ad['addnd'] = instance;
    return instance;
  }
  static attachToMany(selector, opt) {
    let list = document.querySelectorAll(selector);
    [].forEach.call(list, function(root){
      let instance = new ADDnd(root, opt);
      // attach instance to the root
      root.ad = root.ad || {};
      root.ad['addnd'] = instance;
    })
  }
  static getInstance(root) {
    return root.ad && root.ad['addnd'] ? root.ad['addnd'] : null;
  }

  get root(){
    return this.root_;
  }
  constructor(root, opt = {}) {
    this.root_ = root;
    this.opt_ = opt;
    this.listeners_ = {
      dragstart: (e) => this.dragstart_(e),
      dragenter: (e) => this.dragenter_(e),
      dragover: (e) => this.dragover_(e),
      dragleave: (e) => this.dragleave_(e),
      drop: (e) => this.drop_(e),
      dragend: (e) => this.dragend_(e)
    };

    this.initialize();
  }
  initialize(opt) {
    this.activate();
  }

  setEventOpt_() {
    let opt = this.opt_;
    let eventOpt = [];
    let drop = ['dragenter', 'dragover', 'dragleave', 'drop', 'dragend'];
    let drag = ['dragstart'];

    if(opt.action === 'drop'){
      eventOpt = drop;
    } else if(opt.action === 'drag') {
      eventOpt = drag;
      eventOpt.push('dragend');
    } else if(opt.action === 'all' || !opt.action){
      eventOpt = drop.concat(drag);
    }
    this.eventOpt_ = eventOpt;
  }

  activate(action) {
    if(action) {
      this.opt_.action = action;
    }
    this.setEventOpt_();
    this.addEventListeners_();
  }
  deactivate() {
    this.removeEventListeners_();
  }

  addEventListeners_() {
    this.eventOpt_.forEach((k)=>{
      this.listen(k, this.listeners_[k]);
    });
  }
  removeEventListeners_(){
    this.eventOpt_.forEach((k)=>{
      this.unlisten(k, this.listeners_[k]);
    });
  }

  listen(evtType, handler) {
    this.root_.addEventListener(evtType, handler);
  }
  unlisten(evtType, handler) {
   this.root_.removeEventListener(evtType, handler);
  }
  emit(evtType, evtData, shouldBubble = false) {
   let evt;
   if (typeof CustomEvent === 'function') {
     evt = new CustomEvent(evtType, {
       detail: evtData,
       bubbles: shouldBubble,
     });
   } else {
     evt = document.createEvent('CustomEvent');
     evt.initCustomEvent(evtType, shouldBubble, false, evtData);
   }

   this.root_.dispatchEvent(evt);
  }

  dragstart_(e) {
    this.root_.style.opacity = numbers.OP_START;
    e.dataTransfer.setData("text", this.root_.id);
  }
  dragenter_(e) {
    this.root_.classList.add(cssClasses.OVER);
  }
  dragover_(e) {
    e.preventDefault();
    e.stopPropagation();

    this.root_.classList.add(cssClasses.OVER);
    // The item will be moved from the orinal container.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
    e.dataTransfer.dropEffect = 'move';
  }
  dragleave_(e) {
    this.root_.classList.remove(cssClasses.OVER);
  }
  drop_(e) {
   e.preventDefault();
   e.stopPropagation();

   let drop = this.opt_.drop;
   let dropRes = false;
   if(drop) {
      drop.call(this, e, (r) => {
        dropRes = r;
      })
   }
   if(!dropRes){
     // Pass id through the event.
     let id = e.dataTransfer.getData("text");
     let el = document.getElementById(id);
     this.root_.appendChild(el);
    }

   this.clean(e);
   // Fire change event. TODO: For now threre is not data...
   this.emit('change')
  }
  dragend_(e) {
    this.clean(e);
  }
  clean(e){
    if(e){
      let id = e.dataTransfer.getData("text");
        if(id) {
          let el = document.getElementById(id);
          let dropInst = ADDnd.getInstance(el);
          dropInst.root_.style.opacity = numbers.OP_END;
          dropInst.root_.classList.remove(cssClasses.OVER);
        }
    }
    this.root_.style.opacity = numbers.OP_END;
    this.root_.classList.remove(cssClasses.OVER);
  }
}
