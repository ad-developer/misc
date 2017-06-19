// Checkbox
let cb = document.querySelectorAll('[ad-checkbox]');
for (let i = 0; i < cb.length; i++) {
  cb[i].addEventListener('click', function(e){
    this.classList.add('hide');
    let el = this.parentElement.querySelector('[ad-hidden]');
    el.classList.remove('hide');
    el.removeAttribute('ad-hidden');
    this.setAttribute('ad-hidden', true);
  });
}

// Dnd

/*
  Container handlers
*/
let util = {
    getParentOfType: function(el, type){
      if(el.nodeName === type){
        return el;
      }
      let parent = el.parentElement;
      if(parent.nodeName === type){
        return parent;
      } else {
        return util.getParentOfType(el, type);
      }
    }
};

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

function handleDrop(e) {
   e.preventDefault();
  // this / e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  let data = event.dataTransfer.getData("text");
  let el = document.getElementById(data);
  //var rad = document.createElement("input");
  //el.appendChild(rad);
  // Check if it's main container or item
  if(e.target.nodeName === 'UL'){
    e.target.appendChild(el);
  }
  if(e.target.nodeName === 'LI' && e.target.hasAttribute('no-drop')){
    e.target.parentElement.appendChild(el);
  } else {
    let parent = e.target.parentElement;
    parent.insertBefore(el, e.target);
  }

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

function handleDragLeave(e) {
  this.classList.remove('ad-over');  // this / e.target is previous target element.
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
  let el = util.getParentOfType(e.target, 'LI');
  if(!el.hasAttribute('no-drop')){
    el.classList.add('ad-over');
  } else {
    // work with container instead
    el.parentElement.classList.add('ad-over');
  }
}

function handleDragLeaveItem(e) {
  let el = util.getParentOfType(e.target, 'LI');
  if(!el.hasAttribute('no-drop')){
    el.classList.remove('ad-over');
  } else {
    // work with container instead
    el.parentElement.classList.remove('ad-over');
  }
}

// Item(s) event listner
var cols = document.querySelectorAll('[ad-dnd-con] [ad-dnd-item]');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStartItem, false);
  col.addEventListener('dragenter', handleDragEnterItem, false);
  col.addEventListener('dragover', handleDragOverItem, false);
  col.addEventListener('dragleave', handleDragLeaveItem, false);
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
