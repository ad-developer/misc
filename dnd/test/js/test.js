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

const htmStrings = {
  CHECK_BOX: '<span class=ad-right-24><i ad-checkbox class="list-icon checked"role=button><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> </i><i ad-checkbox class="list-icon hide"role=button ad-hidden><svg viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z"fill=none /></svg></i></span>'
};

const insertAfter = (newNode, referenceNode) =>{
  let el     referenceNode.parentNode.insertBefore(document.createElement(newNode), referenceNode.nextSibling);
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
  // transformation
  let grip = dropInst.root.querySelector('[ad-dnd-grip]');
  insertAfter(htmStrings.CHECK_BOX, grip);

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
    dropInst.deactivate();
    dropInst.activate('drag');
    // transformation

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
    dropInst.deactivate();
    dropInst.activate('all');
    // transformation

    callback(false);
  }
});


document.getElementById('btn').addEventListener('click', function(){});

document.querySelectorAll('[ad-drop]').forEach((el)=>{
  el.addEventListener('change', ()=>{
    //alert('change');
  });
});
