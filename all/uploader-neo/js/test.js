
// Attach component to the HTML root element
const root = document.getElementById('uploader')
ADUploader.attachTo(root);

// Register events
root.addEventListener('upload', (e)=>{
  let uploader = e.detail;
  uploader.processIndicator();
  let data = uploader.getFormData();

  // Set up the request.
  let xhr = new XMLHttpRequest();


  // Register few events...
  xhr.upload.addEventListener("progress", (e)=>{
    if (e.lengthComputable) {
      var pctCompl = e.loaded / e.total;
      console.log(pctCompl * 100);
    } else {
      // Unable to compute progress information since the total size is unknown
    }
  });
  xhr.addEventListener("error", (e)=>{
    alert('Error...')
  });
  // Open the connection.
  xhr.open('POST', '/upload', true);

  // Set Header
  //xhr.setRequestHeader()
  // Set up a handler for when the request finishes.
  xhr.onload = (e)=> {
    if (xhr.status === 200) {
      uploader.setFileList();
      alert('Uploaded...');
    } else {
      alert('Error... on load...');
    }
    uploader.processIndicator(true)
  };

  xhr.send(data);

  // submit form data aka files here...
  // once done set them to the
  // and ... do not formget to stop
  // processIndicator...


  //setTimeout(()=> {
  //    uploader.processIndicator(true)
  //    console.log('upload event');
  //  }, 2000);
  // do something...
  // e.processIndiator('stop');
  // e.setFileList([...]);

  // e.detail contains uploader object


});

root.addEventListener('add', (e)=>{
  // All add activities happen here...
  console.log('add event');
});

root.addEventListener('delete', (e)=>{
  // All add activities happen here...
  console.log('add event');
});
