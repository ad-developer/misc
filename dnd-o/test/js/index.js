// index.js
/*
  Container handlers
*/

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

let guid = 1;
const HtmTemplates = {
  GRIP: '<div class="ad-grip ad-right-medium"draggable=true><div class=ad-grip-row><div class=ad-grip-col></div><div class=ad-grip-col></div></div><div class=ad-grip-row><div class=ad-grip-col></div><div class=ad-grip-col></div></div><div class=ad-grip-row><div class=ad-grip-col></div><div class=ad-grip-col></div></div><div class=ad-grip-row><div class=ad-grip-col></div><div class=ad-grip-col></div></div><div class=ad-grip-row><div class=ad-grip-col></div><div class=ad-grip-col></div></div><div class=ad-grip-row><div class=ad-grip-col></div><div class=ad-grip-col></div></div><div class=ad-grip-row><div class=ad-grip-col></div><div class=ad-grip-col></div></div><div class=ad-grip-row><div class=ad-grip-col></div><div class=ad-grip-col></div></div></div>',
  SOURCE_TYPE_ONE: '<span class="ad-right-24 list-type"title=People><i class=list-icon><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> </i></span><span class=list-title>People Picker Test Control</span>'
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('ad-over');
}

function handleDragLeave(e) {
  this.classList.remove('ad-over');  // this / e.target is previous target element.
}

function handleDrop(e) {
   e.preventDefault();
  // this / e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  let data = event.dataTransfer.getData("text");
  let el = document.getElementById(data);
  this.appendChild(el);
  return false;
}

function handleDragEnd(e) {
  [].forEach.call(container, function (col) {
    col.classList.remove('ad-over');
  });
  [].forEach.call(cols, function (col) {
    col.style.opacity = '1';
    col.classList.remove('ad-over');
  });
}

/*
  Item handlers
*/
function handleDragStartItem(e) {
  let li = this;
  li.style.opacity = '0.4';
  e.dataTransfer.setData("text", li.id);
}

function handleDragOverItem(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
  return false;
}

function handleDragEnterItem(e) {
  //let el = util.getParentOfType(e.target, 'LI');
  //console.log(`enter item ${this.id} ${guid++}`);


  if(!this.hasAttribute('no-drop')){
    this.classList.add('ad-over');
  } else {
    // work with container instead
    this.parentElement.classList.add('ad-over');
  }
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
}

function handleDragLeaveItem(e) {
  //console.log(this.contains(e.target));

  if(!this.hasAttribute('no-drop')){
    this.classList.remove('ad-over');
  } else {
    // work with container instead
    this.parentElement.classList.remove('ad-over');
  }
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
}

/*
  Item drop handlers
*/
function handleDropItem(e) {
   e.preventDefault();
  // this / e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  let data = event.dataTransfer.getData("text");
  let el = document.getElementById(data);

  let parent = this.parentElement;
  parent.insertBefore(el, this);

  return false;
}

function handleDragEndItem(e) {
  [].forEach.call(container, function (col) {
    col.classList.remove('ad-over');
  });
  [].forEach.call(cols, function (col) {
    col.style.opacity = '1';
    col.classList.remove('ad-over');
  });
}


// Item(s) event listner
var cols = document.querySelectorAll('[ad-dnd-con] [ad-dnd-item]');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStartItem, false);
  col.addEventListener('dragenter', handleDragEnterItem, false);
  col.addEventListener('dragover', handleDragOverItem, false);
  col.addEventListener('dragleave', handleDragLeaveItem, false);
});

var itemsDrop = document.querySelectorAll('[ad-dnd-con] [ad-drop]');
[].forEach.call(itemsDrop, function(col) {
  col.addEventListener('drop', handleDropItem, false);
  col.addEventListener('dragend', handleDragEndItem, false);
});

// Container(s) event listner
var container = document.querySelectorAll('[ad-dnd-con]');
[].forEach.call(container, function(col) {
  col.addEventListener('dragenter', handleDragEnter, false);
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});

util.el('app').addEventListener('change', function(e){
  //alert(this.getAttribute('ad-text'));
});

til.el('use').addEventListener('change', function(e){
   //alert(this.getAttribute('ad-text'));
});
