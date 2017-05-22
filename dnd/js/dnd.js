
function handleDragStart(e) {
  this.style.opacity = '0.4';
  e.dataTransfer.setData("Text", event.target.id);
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
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDragOverItem(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
  return false;
}

function handleDragEnterItem(e) {
  // this / e.target is the current hover target.
  this.classList.add('over-item');
}

function handleDragLeaveItem(e) {
  this.classList.remove('over-item');  // this / e.target is previous target element.
}

function handleDrop(e) {
   e.preventDefault();
  // this / e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  var data = event.dataTransfer.getData("Text");
  var el = document.getElementById(data);
  //var rad = document.createElement("input");
  //el.appendChild(rad);
  // Check if it's main container or item
  if(e.target.nodeName === 'UL'){
    e.target.appendChild(el);
  } else {
    var parent = e.target.parentElement;
    parent.insertBefore(el, e.target);
  }

  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.

  [].forEach.call(dropCon, function (col) {
    col.classList.remove('over');
  });
  [].forEach.call(cols, function (col) {
    col.style.opacity = '1';
    col.classList.remove('over-item');
  });
}

var cols = document.querySelectorAll('[ad-dnd-con] li');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStart, false);

  col.addEventListener('dragenter', handleDragEnterItem, false);
  col.addEventListener('dragover', handleDragOverItem, false);
  col.addEventListener('dragleave', handleDragLeaveItem, false);
  //col.addEventListener('dragend', handleDragEnd, false);
});

var dropCon = document.querySelectorAll('[ad-dnd-con]');
[].forEach.call(dropCon, function(col) {
  col.addEventListener('dragenter', handleDragEnter, false);
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});
