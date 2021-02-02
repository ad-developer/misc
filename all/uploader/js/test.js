ADUploader.attachTo(document.getElementById('uploader'),{add: true, url: '/upload'});

let btn = document.getElementById('btnData');
btn.addEventListener('click', (e)=>{
  let inst = ADUploader.getInstance(document.getElementById('uploader'));
  alert(inst.getFormData());
});

document.getElementById('uploader').addEventListener('upload', (e) => {
  //alert('event is here');
});
